import { defineEventHandler, createError } from 'h3'
import { getAllSections } from '../../services/section.service'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const sections = await getAllSections(locale)
    return createSuccessResponse(sections)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_SECTIONS')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
