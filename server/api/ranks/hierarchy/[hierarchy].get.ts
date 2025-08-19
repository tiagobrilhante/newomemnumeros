import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getRanksByHierarchy } from '../../../services/rank.service'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { rank } from '#shared/types/rank'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<rank[]>> => {
  const locale = getLocale(event)
  const hierarchyParam = getRouterParam(event, 'hierarchy')

  try {
    const ranks = await getRanksByHierarchy(Number(hierarchyParam), locale)
    return createSuccessResponse(ranks)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_RANKS_BY_HIERARCHY')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
