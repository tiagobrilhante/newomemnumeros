import { defineEventHandler, readBody, createError } from 'h3'
import { createSection } from '../../services/section.service'
import { sectionCreateSchema } from '../../schemas/section.schema'
import { handleError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    const validation = sectionCreateSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: 'Dados inválidos',
        data: validation.error,
      })
    }

    const section = await createSection(validation.data, locale)
    return createSuccessResponse(section)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'CREATE_SECTION')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
