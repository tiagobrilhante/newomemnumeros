import { prisma } from '../../utils/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validação básica
    if (!body || !body.serviceName) {
      return createError({
        statusCode: 400,
        message: 'A busca deve conter alguma informação.',
      })
    }

    const searchTerm = body.serviceName.toLowerCase()

    return await prisma.user.findMany({
      where: {
        serviceName: {
          contains: searchTerm,
        },
      },
      select: {
        id: true,
        serviceName: true,
        name: true,
        rank: true,
        password: false
      },
    })
  } catch (error) {
    console.error('Erro ao pesquisar usuário:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao pesquisar usuário',
    })
  }
})
