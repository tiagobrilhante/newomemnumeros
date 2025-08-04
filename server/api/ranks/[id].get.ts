import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale, serverTByLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: await serverTByLocale(locale, 'errors.invalidId'),
    })
  }

  try {
    const rank = await prisma.rank.findUnique({
      where: {
        id,
      },
    })

    if (!rank) {
      throw createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.rankNotFound'),
      })
    }

    return createSuccessResponse(rank)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_RANK_BY_ID')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
