import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (_event) => {
  try {
    return await prisma.militaryOrganization.findMany({
      where: {
        deleted: false,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })
  } catch (error) {
    console.error('Erro ao buscar Organizações Militares:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Organizações Militares',
    })
  }
})
