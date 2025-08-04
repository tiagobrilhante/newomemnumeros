import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    if (!body || !body.serviceName) {
      throw createError({
        statusCode: 400,
        message: 'A busca deve conter alguma informação.',
      })
    }

    const [seviceName] = body.serviceName.split('-')

    const searchTerm = seviceName.toLowerCase()

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
        password: false,
      },
    })

    return createSuccessResponse(users)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_USER_BY_SERVICENAME')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
