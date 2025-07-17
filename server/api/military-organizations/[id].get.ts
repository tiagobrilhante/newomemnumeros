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
    const militaryOrganization = await prisma.militaryOrganization.findUnique({
      where: {
        id: Number(id),
        deleted: false,
      },
      include: {
        users: {
          where: {
            deleted: false,
          },
        },
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })

    if (!militaryOrganization) {
      return createError({
        statusCode: 404,
        message: 'Organização Militar não encontrada',
      })
    }

    return militaryOrganization
  } catch (error) {
    console.error(`Erro ao buscar Organização Militar ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Organização Militar',
    })
  }
})
