import { prisma } from '../../../utils/prisma'
import path from 'path'
import fs from 'fs/promises'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  // todo, tenho que refatorar isso para um service...
  try {
    const militaryOrganization = await prisma.militaryOrganization.findUnique({
      where: {
        id,
        deleted: false,
      },
    })

    if (militaryOrganization && militaryOrganization.logo !== '/logos/default/default.png') {
      console.time('removeFiles')
      const userDir = path.resolve(
        'public',
        'logos',
        path.dirname(militaryOrganization.logo).replace(/^\/logos\//, ''),
      )
      await fs.rm(userDir, { recursive: true, force: true })
      console.timeEnd('removeFiles')
    }

    return await prisma.militaryOrganization.update({
      where: { id, deleted: false },
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
