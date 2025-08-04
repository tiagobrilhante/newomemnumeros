import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale, serverTByLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    if (!body.name || !body.acronym || body.hierarchy === undefined) {
      throw createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    const rank = await prisma.rank.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        hierarchy: body.hierarchy,
      },
    })

    return createSuccessResponse(rank)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'CREATE_RANK')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
