import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import type { section } from '#shared/types/sections'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<section>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const section = await prisma.section.findUnique({
      where: {
        id,
        deleted: false,
      },
      include: {
        militaryOrganization: true,
      },
    })

    if (!section) {
      throw createError({
        statusCode: 404,
        message: 'Seção não encontrada',
      })
    }

    return createSuccessResponse(section)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'GET_SECTION_BY_ID')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
