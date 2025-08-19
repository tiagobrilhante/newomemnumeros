import { defineEventHandler, readBody, createError } from 'h3'
import { createMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { militaryOrganization } from '#shared/types/military-organization'
import {
  militaryOrganizationCreateSchema,
  validateMilitaryOrganizationData
} from '../../schemas/militaryOrganization.schema'
import { createValidationError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<militaryOrganization>> => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    const validation = await validateMilitaryOrganizationData(
      militaryOrganizationCreateSchema,
      body,
      locale
    )

    if (!validation.success) {
      throw await createValidationError(validation.errors, locale)
    }

    const militaryOrganization = await createMilitaryOrganization(validation.data, locale)
    return createSuccessResponse(militaryOrganization)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'CREATE_MILITARY_ORGANIZATION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
