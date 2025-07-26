import { deleteRank } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  try {
    return await deleteRank(id as string, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
