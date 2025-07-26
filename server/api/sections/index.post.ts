import {prisma} from '../../utils/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validação básica
    if (!body.name || !body.acronym) {
      return createError({
        statusCode: 400,
        message: 'Dados inválidos. Nome, sigla são obrigatórios.',
      })
    }

    return await prisma.section.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        militaryOrganizationId: body.militaryOrganizationId,
      },
      include: {
        militaryOrganization: true,
      },
    })
  } catch (error) {
    console.error('Erro ao criar Organização Militar:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao criar Organização Militar',
    })
  }
})
