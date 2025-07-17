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
    return await prisma.section.findMany({
      where: {
        militaryOrganizationId: Number(id),
        deleted: false,
      },
      include: {
        militaryOrganization: true,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar Seções por Id de Om:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Seções por Id de Om',
    })
  }
})
