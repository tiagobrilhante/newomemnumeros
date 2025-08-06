import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateRole } from '../../services/role.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { Role } from '#shared/types/role'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<Role>> => {
  const locale = getLocale(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw new Error('Role ID is required')
    }

    const roleData = await readBody(event)
    const updatedRole = await updateRole(id, roleData, locale)
    return createSuccessResponse(updatedRole)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'UPDATE_ROLE')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})