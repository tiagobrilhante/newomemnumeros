import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validação básica
    if (!body.name || !body.acronym || body.hierarchy === undefined) {
      return createError({
        statusCode: 400,
        message: 'Dados inválidos. Nome, sigla e hierarquia são obrigatórios.',
      })
    }

    return await prisma.rank.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        hierarchy: body.hierarchy,
      },
    })
  } catch (error) {
    console.error('Erro ao criar rank:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao criar rank',
    })
  }
})
