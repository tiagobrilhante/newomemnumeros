import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id ) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const body = await readBody(event)

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: body,
    })

    return createSuccessResponse(user)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'UPDATE_USER')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
