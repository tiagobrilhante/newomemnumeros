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
    const section = await prisma.section.findUnique({
      where: {
        id: Number(id),
        deleted: false,
      },
      include: {
        militaryOrganization: true,
      },
    })

    if (!section) {
      return createError({
        statusCode: 404,
        message: 'Seção não encontrada',
      })
    }

    return section
  } catch (error) {
    console.error(`Erro ao buscar Seção ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Seção',
    })
  }
})
