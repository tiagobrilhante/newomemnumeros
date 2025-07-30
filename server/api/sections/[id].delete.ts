import { deleteSection } from '../../services/section.service'
import { sectionParamsSchema } from '../../schemas/section.schema'
import { getLocale } from '../../utils/i18n'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const locale = getLocale(event) || 'pt-BR'

    const validation = sectionParamsSchema.safeParse({ id })
    if (!validation.success) {
      return createError({
        statusCode: 400,
        message: 'ID inválido',
        data: validation.error.issues,
      })
    }

    const result = await deleteSection(validation.data.id, locale)
    return result
  } catch (error: any) {
    console.error('Erro ao deletar seção:', error)
    throw error
  }
})
