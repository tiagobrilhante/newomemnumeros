import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteSection } from '../../services/section.service'
import { sectionParamsSchema } from '../../schemas/section.schema'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const id = getRouterParam(event, 'id')

    const validation = sectionParamsSchema.safeParse({ id })
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: 'ID inválido',
        data: validation.error.issues,
      })
    }

    const result = await deleteSection(validation.data.id, locale)
    return createSuccessResponse(result)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'DELETE_SECTION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
