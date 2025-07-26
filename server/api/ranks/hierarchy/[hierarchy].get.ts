import { getRanksByHierarchy } from '../../../services/rank.service'
import { handleError } from '../../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const hierarchyParam = getRouterParam(event, 'hierarchy')

  try {
    return await getRanksByHierarchy(Number(hierarchyParam), locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
