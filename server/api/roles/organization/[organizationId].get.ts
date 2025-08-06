import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getRolesByOrganization } from '../../../services/role.service'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { Role } from '#shared/types/role'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<Role[]>> => {
  const locale = getLocale(event)

  try {
    const organizationId = getRouterParam(event, 'organizationId')
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const roles = await getRolesByOrganization(organizationId, locale)
    return createSuccessResponse(roles)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_ROLES_BY_ORGANIZATION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})