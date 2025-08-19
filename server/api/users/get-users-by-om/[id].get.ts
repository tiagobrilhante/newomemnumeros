import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../../prisma'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { UserWithRank } from '#shared/types/user'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UserWithRank[]>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        deleted: false,
      },
      include: {
        rank: true,
      },
    })

    return createSuccessResponse(users)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_USERS_BY_OM')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
