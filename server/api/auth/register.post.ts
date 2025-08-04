import { defineEventHandler, readBody, createError } from 'h3'
import { registerUser } from '../../services/register.service'
import { handleError } from '../../utils/errorHandler'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const data = await readBody(event)
    return await registerUser(data, locale)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'REGISTER')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
