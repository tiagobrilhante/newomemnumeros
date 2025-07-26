import { updateRank } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  try {
    const body = await readBody(event)
    return await updateRank(id as string, body, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
