import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError, createValidationError  } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse, UpdateResponse } from '#shared/types/api-response'
import {
  militaryOrganizationUpdateSchema,
  militaryOrganizationParamsSchema,
  validateMilitaryOrganizationData
} from '../../schemas/militaryOrganization.schema'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UpdateResponse>> => {
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
    const body = await readBody(event)
    const data = { ...body, id: paramValidation.data.id }

    const validation = await validateMilitaryOrganizationData(
      militaryOrganizationUpdateSchema,
      data,
      locale
    )

    if (!validation.success) {
      throw await createValidationError(validation.errors, locale)
    }

    const updatedMilitaryOrganization = await updateMilitaryOrganization(validation.data, locale)
    return createSuccessResponse(updatedMilitaryOrganization)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'UPDATE_MILITARY_ORGANIZATION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
