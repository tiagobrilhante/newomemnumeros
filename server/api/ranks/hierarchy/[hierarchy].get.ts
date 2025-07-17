// noinspection JSUnusedGlobalSymbols

import prisma from '~/server/prisma'

export default defineEventHandler(async (event) => {
  const hierarchy = getRouterParam(event, 'hierarchy')

  if (!hierarchy || isNaN(Number(hierarchy))) {
    throw createError({
      statusCode: 400,
      message: 'Hierarquia inválida',
    })
  }

  try {
    return await prisma.rank.findMany({
      where: {
        hierarchy: Number(hierarchy),
      },
      orderBy: {
        hierarchy: 'asc',
      },
    })
  } catch (error) {
    console.error(`Erro ao buscar ranks por hierarquia ${hierarchy}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar ranks por hierarquia',
    })
  }
})
