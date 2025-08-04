import { z } from 'zod'
import { serverTByLocale } from '../utils/i18n'

// Regex for hex color validation
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

export async function createMilitaryOrganizationSchemas(locale: string = 'pt-BR') {
  const getMessage = async (key: string, fallback: string): Promise<string> => {
    try {
      return await serverTByLocale(locale, key) || fallback
    } catch {
      return fallback
    }
  }

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
      .trim(),

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
    .trim(),

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

// Re-export das funções utilitárias genéricas
export { validateData as validateMilitaryOrganizationData } from '../utils/validation'
