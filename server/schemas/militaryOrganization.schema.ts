import { z } from 'zod'

// Regex for hex color validation
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// Function to create schemas with internationalized messages
export async function createMilitaryOrganizationSchemas(locale: string = 'pt-BR') {
  // Helper to fetch translated messages
  const getMessage = async (key: string, fallback: string): Promise<string> => {
    try {
      return await serverTByLocale(locale, key) || fallback
    } catch {
      return fallback
    }
  }

  // Base schema for military organization
  const baseMilitaryOrganizationSchema = z.object({
    name: z
      .string()
      .min(1, await getMessage('validation.nameRequired', 'Nome não pode estar vazio'))
      .max(255, await getMessage('validation.nameMaxLength', 'Nome deve ter no máximo 255 caracteres'))
      .trim(),

    acronym: z
      .string()
      .min(1, await getMessage('validation.acronymRequired', 'Sigla não pode estar vazia'))
      .max(10, await getMessage('validation.acronymMaxLength', 'Sigla deve ter no máximo 10 caracteres'))
      .trim()
      .transform(val => val.toUpperCase()),

    color: z
      .string()
      .regex(hexColorRegex, await getMessage('validation.invalidColorFormat', 'Cor deve estar no formato hexadecimal (#RRGGBB ou #RGB)'))
      .optional()
      .or(z.literal('').transform(() => undefined)),

    militaryOrganizationId: z
      .uuid(await getMessage('validation.invalidUUID', 'ID da organização pai deve ser um UUID válido'))
      .optional()
      .or(z.literal('').transform(() => undefined))
      .or(z.null().transform(() => undefined)),

    logo: z
      .string()
      .optional()
      .or(z.literal('').transform(() => undefined))
      .or(z.null().transform(() => undefined)),
  })

  // Schema for creation
  const militaryOrganizationCreateSchema = baseMilitaryOrganizationSchema

  // Schema for updates (includes required ID)
  const militaryOrganizationUpdateSchema = baseMilitaryOrganizationSchema.extend({
    id: z
      .uuid(await getMessage('validation.invalidID', 'ID deve ser um UUID válido')),
  })

  // Schema for route parameters
  const militaryOrganizationParamsSchema = z.object({
    id: z
      .uuid(await getMessage('validation.invalidID', 'ID deve ser um UUID válido')),
  })

  return {
    militaryOrganizationCreateSchema,
    militaryOrganizationUpdateSchema,
    militaryOrganizationParamsSchema
  }
}

// Synchronous schemas (for compatibility and simple cases)
const baseMilitaryOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome não pode estar vazio')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),

  acronym: z
    .string()
    .min(1, 'Sigla não pode estar vazia')
    .max(10, 'Sigla deve ter no máximo 10 caracteres')
    .trim()
    .transform(val => val.toUpperCase()),

  color: z
    .string()
    .regex(hexColorRegex, 'Cor deve estar no formato hexadecimal (#RRGGBB ou #RGB)')
    .optional()
    .or(z.literal('').transform(() => undefined)),

  militaryOrganizationId: z
    .uuid('ID da organização pai deve ser um UUID válido')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .or(z.null().transform(() => undefined)),

  logo: z
    .string()
    .optional()
    .or(z.literal('').transform(() => undefined))
    .or(z.null().transform(() => undefined)),
})

// Default schemas (synchronous)
export const militaryOrganizationCreateSchema = baseMilitaryOrganizationSchema

export const militaryOrganizationUpdateSchema = baseMilitaryOrganizationSchema.extend({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

export const militaryOrganizationParamsSchema = z.object({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

// Types inferred from Zod
export type MilitaryOrganizationCreateInput = z.infer<typeof militaryOrganizationCreateSchema>
export type MilitaryOrganizationUpdateInput = z.infer<typeof militaryOrganizationUpdateSchema>
export type MilitaryOrganizationParams = z.infer<typeof militaryOrganizationParamsSchema>

// Helper function to validate data with error handling
export async function validateMilitaryOrganizationData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  locale: string = 'pt-BR'
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })
      return { success: false, errors }
    }

    const unknownErrorMessage = await serverTByLocale(locale, 'validation.unknownError') || 'Erro de validação desconhecido'
    return { success: false, errors: [unknownErrorMessage] }
  }
}

// Helper function to create HTTP error with validation details
export async function createValidationError(errors: string[], locale: string = 'pt-BR') {
  const message = await serverTByLocale(locale, 'validation.invalidInputData') || 'Dados de entrada inválidos'

  return createError({
    statusCode: 400,
    statusMessage: 'Validation Error',
    message,
    data: {
      errors,
      type: 'validation_error'
    }
  })
}

// Helper function for validation with asynchronous internationalization
export async function validateMilitaryOrganizationDataI18n<T>(
  schemaFactory: (locale: string) => Promise<z.ZodSchema<T>>,
  data: unknown,
  locale: string = 'pt-BR'
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const schema = await schemaFactory(locale)
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })
      return { success: false, errors }
    }
    return { success: false, errors: [await serverTByLocale(locale, 'validation.unknownError') || 'Erro de validação desconhecido'] }
  }
}
