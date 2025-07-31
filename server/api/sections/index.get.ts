import { getAllSections } from '../../services/section.service'
import { handleError } from '../../utils/errorHandler'
import { getLocale } from '../../utils/i18n'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event) || 'pt-BR'

  try {
    return await getAllSections(locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
