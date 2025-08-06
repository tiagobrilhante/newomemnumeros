import { defineEventHandler, createError } from 'h3'
import { getAllRoles } from '../../services/role.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { Role } from '#shared/types/role'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<Role[]>> => {
  const locale = getLocale(event)

  try {
    const roles = await getAllRoles(locale)
    return createSuccessResponse(roles)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_ROLES')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})