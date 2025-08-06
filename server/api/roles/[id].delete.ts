import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteRole } from '../../services/role.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<void>> => {
  const locale = getLocale(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw new Error('Role ID is required')
    }

    await deleteRole(id, locale)
    return createSuccessResponse(undefined, 'Role deleted successfully')
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'DELETE_ROLE')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})