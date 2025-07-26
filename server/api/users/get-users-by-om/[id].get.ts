import prisma from '../../../prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    return await prisma.user.findMany({
      where: {
        deleted: false,
      },
      include: {
        rank: true,
      },
    })
  } catch (error) {
    console.error(`Erro ao buscar Usuários na om: ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Usuários na OM',
    })
  }
})
