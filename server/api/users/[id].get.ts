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
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        serviceName: true,
        email: true,
        cpf: true,
        militaryOrganizationId: true,
        rankId: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        rank: true,
        militaryOrganization: true,
        sectionFunctionUser: {
          select: {
            id: true,
            functionName: true,
            sectionId: true,
            userId: true,
            section: true,
          },
        },
      },
    })

    if (!user) {
      return createError({
        statusCode: 404,
        message: 'Usuário não encontrada',
      })
    }

    return user
  } catch (error) {
    console.error(`Erro ao buscar Usuário ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Usuário',
    })
  }
})
