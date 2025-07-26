import { prisma } from '../../utils/prisma'

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
    await prisma.user.delete({
      where: {
        id,
        deleted: false,
      },
    })

    return { message: 'Usuário excluído com sucesso' }
  } catch (error) {
    console.error(`Erro ao excluir Usuário ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao excluir Usuário',
    })
  }
})
