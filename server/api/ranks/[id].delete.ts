import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteRank } from '../../services/rank.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  try {
    const result = await deleteRank(id as string, locale)
    return createSuccessResponse(result)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'DELETE_RANK')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
