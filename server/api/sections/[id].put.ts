import {prisma} from '../../utils/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID inválido',
    })
  }

  try {
    const body = await readBody(event)

    return await prisma.section.update({
      where: {
        id,
      },
      include: {
        militaryOrganization: true,
      },

      data: body,
    })
  } catch (error) {
    console.error(`Erro ao atualizar Seção ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao atualizar Seção',
    })
  }
})
