import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { UserWithRank } from '#shared/types/user'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UserWithRank[]>> => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    // Validação básica
    if (!body || !body.serviceName) {
      throw createError({
        statusCode: 400,
        message: 'A busca deve conter alguma informação.',
      })
    }

    const searchTerm = body.serviceName.toLowerCase()

    const users = await prisma.user.findMany({
      where: {
        serviceName: {
          contains: searchTerm,
        },
      },
      select: {
        id: true,
        serviceName: true,
        name: true,
        rank: true,
        password: false
      },
    })

    return createSuccessResponse(users)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_USERS_BY_SERVICENAME_ALL_OM')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
