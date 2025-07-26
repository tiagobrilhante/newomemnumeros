import prisma from '../../prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id ) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    await prisma.section.delete({
      where: {
        id,
        deleted: false,
      },
    })

    return { message: 'Seção excluída com sucesso' }
  } catch (error) {
    console.error(`Erro ao excluir Seção ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao excluir Seção',
    })
  }
})
