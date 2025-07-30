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

  const sectionCreateSchema = baseSectionSchema

  const sectionUpdateSchema = baseSectionSchema.extend({
    id: z
      .uuid(await getMessage('validation.invalidID', 'ID deve ser um UUID válido')),
  })

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

const baseSectionSchema = z.object({
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

export const sectionCreateSchema = baseSectionSchema

export const sectionUpdateSchema = baseSectionSchema.extend({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

export const sectionParamsSchema = z.object({
  id: z
    .uuid('ID deve ser um UUID válido'),
})

export type SectionCreateInput = z.infer<typeof sectionCreateSchema>
export type SectionUpdateInput = z.infer<typeof sectionUpdateSchema>
export type SectionParams = z.infer<typeof sectionParamsSchema>

export { validateData as validateSectionData, createValidationError } from '../utils/validation'
