import { createSection } from '../../services/section.service'
import { sectionCreateSchema } from '../../schemas/section.schema'
import { getLocale } from '../../utils/i18n'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const locale = getLocale(event) || 'pt-BR'

    const validation = sectionCreateSchema.safeParse(body)
    if (!validation.success) {
      return createError({
        statusCode: 400,
        message: 'Dados inválidos',
        data: validation.error,
      })
    }

    return await createSection(validation.data, locale)
  } catch (error: any) {
    console.error('Erro ao criar seção:', error)
    throw error
  }
})
