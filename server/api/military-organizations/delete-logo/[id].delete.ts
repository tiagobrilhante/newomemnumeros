import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../../prisma'
import path from 'path'
import fs from 'fs/promises'
import { handleError } from '../../../utils/errorHandler'
import { createSuccessResponse } from '../../../utils/responseWrapper'
import { getLocale } from '../../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import {
  militaryOrganizationParamsSchema,
  validateMilitaryOrganizationData
} from '../../../schemas/militaryOrganization.schema'
import { createValidationError } from '../../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  const paramValidation = await validateMilitaryOrganizationData(
    militaryOrganizationParamsSchema,
    { id },
    locale
  )

  if (!paramValidation.success) {
    throw await createValidationError(paramValidation.errors, locale)
  }

  try {
    const validatedId = paramValidation.data.id

    const militaryOrganization = await prisma.militaryOrganization.findUnique({
      where: {
        id: validatedId,
        deleted: false,
      },
    })

    if (militaryOrganization && militaryOrganization.logo !== '/logos/default/default.png') {
      const userDir = path.resolve(
        'public',
        'logos',
        path.dirname(militaryOrganization.logo).replace(/^\/logos\//, '')
      )
      await fs.rm(userDir, { recursive: true, force: true })
    }

    const updatedMilitaryOrganization = await prisma.militaryOrganization.update({
      where: { id: validatedId, deleted: false },
      data: {
        logo: '/logos/default/default.png',
      },
      include: {
        subOrganizations: true,
        parentOrganization: true,
      },
    })

    return createSuccessResponse(updatedMilitaryOrganization)
  } catch (error) {
    const errorResponse = await handleError(error, locale, 'DELETE_MILITARY_ORGANIZATION_LOGO')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
