import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse, DeleteResponse } from '#shared/types/api-response'
import {
  militaryOrganizationParamsSchema,
  validateMilitaryOrganizationData
} from '../../schemas/militaryOrganization.schema'
import { createValidationError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<DeleteResponse>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  const paramValidation = await validateMilitaryOrganizationData(
    militaryOrganizationParamsSchema,
    { id },
    locale
  )

  if (!paramValidation.success) {
    throw await createValidationError(paramValidation.errors, locale)
  }

  try {
    const result = await deleteMilitaryOrganization(paramValidation.data.id, locale)
    return createSuccessResponse(result)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'DELETE_MILITARY_ORGANIZATION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
