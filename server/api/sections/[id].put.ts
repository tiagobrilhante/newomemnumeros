import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateSection } from '../../services/section.service'
import { sectionUpdateSchema } from '../../schemas/section.schema'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse, UpdateResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<UpdateResponse>> => {
  const locale = getLocale(event)

  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID inválido',
      })
    }

    const dataWithId = { ...body, id }
    
    const validation = sectionUpdateSchema.safeParse(dataWithId)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: 'Dados inválidos',
        data: validation.error.errors,
      })
    }

    const section = await updateSection(validation.data, locale)
    return createSuccessResponse(section)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'UPDATE_SECTION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
