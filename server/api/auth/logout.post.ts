import { defineEventHandler, createError } from 'h3'
import { clearAuthCookie } from '../../utils/cookieAuth'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale, serverTByLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

interface LogoutResponse {
  message: string
}

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<LogoutResponse>> => {
  const locale = getLocale(event)

  try {
    clearAuthCookie(event)
    const message = await serverTByLocale(locale, 'success.logoutSuccess')
    
    return createSuccessResponse({ message })
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'LOGOUT')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
