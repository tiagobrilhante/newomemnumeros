import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getRoleUsage } from '../../../services/role.service'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { RoleUsage } from '#shared/types/role'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<RoleUsage>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    const errorResponse = await handleError(
      new Error('Role ID is required'), 
      locale, 
      'GET_ROLE_USAGE'
    )
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }

  try {
    const usage = await getRoleUsage(id, locale)
    return createSuccessResponse(usage)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_ROLE_USAGE')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})