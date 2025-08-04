import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../../prisma'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        militaryOrganizationId: id,
        deleted: false,
      },
      include: {
        militaryOrganization: true,
      },
    })

    return createSuccessResponse(sections)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_SECTIONS_BY_OM_ID')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
