import {prisma} from '../../utils/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (_event) => {
  try {
    return await prisma.section.findMany({
      where: {
        deleted: false,
      },
      include: {
        militaryOrganization: true,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar Seções:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Seções',
    })
  }
})
