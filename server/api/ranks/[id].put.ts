import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateRank } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse, UpdateResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UpdateResponse>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  try {
    const body = await readBody(event)
    const rank = await updateRank(id as string, body, locale)
    return createSuccessResponse(rank)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'UPDATE_RANK')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
