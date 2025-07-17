import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    await prisma.militaryOrganization.delete({
      where: {
        id: Number(id),
        deleted: false,
      },
    })

    return { message: 'Organização Militar excluída com sucesso' }
  } catch (error) {
    console.error(`Erro ao excluir Organização Militar ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao excluir Organização Militar',
    })
  }
})
