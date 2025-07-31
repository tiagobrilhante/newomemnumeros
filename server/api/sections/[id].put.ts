import { updateSection } from '../../services/section.service'
import { sectionUpdateSchema } from '../../schemas/section.schema'
import { getLocale } from '../../utils/i18n'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const locale = getLocale(event) || 'pt-BR'

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID inválido',
      })
    }

    const dataWithId = { ...body, id }
    
    const validation = sectionUpdateSchema.safeParse(dataWithId)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: 'Dados inválidos',
        data: validation.error.errors,
      })
    }

    return await updateSection(validation.data, locale)
  } catch (error: any) {
    console.error('Erro ao atualizar seção:', error)
    throw error
  }
})
