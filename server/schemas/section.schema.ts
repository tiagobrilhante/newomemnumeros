import { z } from 'zod'

export async function createSectionSchemas(locale: string = 'pt-BR') {
  const getMessage = async (key: string, fallback: string): Promise<string> => {
    try {
      return await serverTByLocale(locale, key) || fallback
    } catch {
      return fallback
    }
  }

  const baseSectionSchema = z.object({
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

    militaryOrganizationId: z
      .uuid(await getMessage('validation.invalidUUID', 'ID da organização militar deve ser um UUID válido'))
      .optional()
      .or(z.literal('').transform(() => undefined))
      .or(z.null().transform(() => undefined)),
  })

  // Schema for creation
  const sectionCreateSchema = baseSectionSchema

  // Schema for updates (includes required ID)
  const sectionUpdateSchema = baseSectionSchema.extend({
    id: z
      .uuid(await getMessage('validation.invalidID', 'ID deve ser um UUID válido')),
  })

  // Schema for route parameters
  const sectionParamsSchema = z.object({
    id: z
      .uuid(await getMessage('validation.invalidID', 'ID deve ser um UUID válido')),
  })

  return {
    sectionCreateSchema,
    sectionUpdateSchema,
    sectionParamsSchema
  }
}

const basesectionSchema = z.object({
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

  militaryOrganizationId: z
    .uuid('ID da organização pai deve ser um UUID válido')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .or(z.null().transform(() => undefined)),
})

// Default schemas (synchronous)
export const sectionCreateSchema = basesectionSchema

export const sectionUpdateSchema = basesectionSchema.extend({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

export const sectionParamsSchema = z.object({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

// Types inferred from Zod
export type SectionCreateInput = z.infer<typeof sectionCreateSchema>
export type SectionUpdateInput = z.infer<typeof sectionUpdateSchema>
export type SectionParams = z.infer<typeof sectionParamsSchema>

// Helper function to validate data with error handling
export async function validateSectionData<T>(
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
export async function validateSectionDataI18n<T>(
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
