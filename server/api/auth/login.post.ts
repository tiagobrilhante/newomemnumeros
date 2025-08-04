import { defineEventHandler, readBody, createError } from 'h3'
import { authenticateUser } from '../../services/auth.service'
import { generateJwtToken } from '../../utils/jwtUtils'
import { handleError } from '../../utils/errorHandler'
import { setAuthCookie } from '../../utils/cookieAuth'
import { createSuccessResponse, wrapAsyncOperation } from '../../utils/responseWrapper'
import { getLocale, serverTByLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

interface LoginResponse {
  user: any
  message?: string
}

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<LoginResponse>> => {
  const locale = getLocale(event)

  const operation = async () => {
    const { email, password } = await readBody(event)
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'errors.missingCredentials'
      })
    }

    const user = await authenticateUser(email, password)
    const token = generateJwtToken(user.id)
    setAuthCookie(event, token)
    
    const message = await serverTByLocale(locale, 'auth.loginSuccess')
    
    return {
      user,
      message
    }
  }

  try {
    const result = await operation()
    return createSuccessResponse(result)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'LOGIN')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
