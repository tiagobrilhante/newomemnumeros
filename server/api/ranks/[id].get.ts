import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    return createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const rank = await prisma.rank.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!rank) {
      return createError({
        statusCode: 404,
        message: 'Rank não encontrado',
      })
    }

    return rank
  } catch (error) {
    console.error(`Erro ao buscar rank ${id}:`, error)
    return createError({
      statusCode: 500,
      message: 'Erro ao buscar rank',
    })
  }
})
