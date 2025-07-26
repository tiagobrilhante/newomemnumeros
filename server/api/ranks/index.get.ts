import { getAllRanks } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    return await getAllRanks(locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
