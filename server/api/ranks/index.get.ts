import { defineEventHandler, createError } from 'h3'
import { getAllRanks } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { rank } from '#shared/types/rank'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<rank[]>> => {
  const locale = getLocale(event)

  try {
    const ranks = await getAllRanks(locale)
    return createSuccessResponse(ranks)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_RANKS')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
