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
    const body = await readBody(event)

    return await prisma.section.update({
      where: {
        id: Number(id),
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
