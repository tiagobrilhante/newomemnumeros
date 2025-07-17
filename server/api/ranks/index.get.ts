import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (_event) => {
  try {
    return await prisma.rank.findMany({
      select: {
        id: true,
        name: true,
        acronym: true,
        hierarchy: true,
      },
      orderBy: {
        hierarchy: 'asc',
      },
    })
  } catch (error) {
    console.error('Erro ao buscar ranks:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar ranks',
    })
  }
})
