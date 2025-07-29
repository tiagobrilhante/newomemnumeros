import prisma from '../../../prisma'
import path from 'path'
import fs from 'fs/promises'
import {
  militaryOrganizationParamsSchema,
  validateMilitaryOrganizationData,
  createValidationError
} from '../../../schemas/militaryOrganization.schema'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
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

    return await prisma.militaryOrganization.update({
      where: { id: validatedId, deleted: false },
      data: {
        logo: '/logos/default/default.png',
      },
      include: {
        subOrganizations: true,
        parentOrganization: true,
      },
    })
  } catch (error) {
    console.error(`Erro ao excluir logo da Organização Militar ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao excluir logo da Organização Militar',
    })
  }
})
