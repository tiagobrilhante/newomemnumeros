import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { UserWithRank } from '#shared/types/user'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UserWithRank>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id ) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        serviceName: true,
        email: true,
        cpf: true,
        rankId: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        rank: true,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Usuário não encontrada',
      })
    }

    return createSuccessResponse(user)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_USER_BY_ID')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
