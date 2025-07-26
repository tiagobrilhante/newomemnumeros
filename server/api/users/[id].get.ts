import { prisma } from '../../utils/prisma'

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
    const user = await prisma.user.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        serviceName: true,
        email: true,
        cpf: true,
        rankId: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        rank: true,
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
