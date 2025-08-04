import { defineEventHandler, createError } from 'h3'
import { getAllMilitaryOrganizations } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const militaryOrganizations = await getAllMilitaryOrganizations(locale)
    return createSuccessResponse(militaryOrganizations)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_MILITARY_ORGANIZATIONS')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
