import { defineEventHandler, createError } from 'h3'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<boolean>> => {
  const locale = getLocale(event)

  try {
    // Verificar se existe usuário no contexto do evento
    const user = event.context.user

    const hasAccess = !!user
    return createSuccessResponse(hasAccess)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'CHECK_USER_ACCESS')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
