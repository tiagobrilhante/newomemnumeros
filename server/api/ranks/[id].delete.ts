// noinspection JSUnusedGlobalSymbols

import prisma from '~/server/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    await prisma.rank.delete({
      where: {
        id: Number(id),
      },
    })

    return { message: 'Rank deletado com sucesso' }
  } catch (error) {
    console.error(`Erro ao deletar rank ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao deletar rank',
    })
  }
})
