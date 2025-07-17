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
    return await prisma.user.findMany({
      where: {
        militaryOrganizationId: Number(id),
        deleted: false,
      },
      include: {
        militaryOrganization: true,
        rank: true,
        sectionFunctionUser: {
          include: {
            section: true,
          },
        },
        permissionSetupUser: {
          include: {
            permissionSetup: {
              include: {
                permissions: {
                  include: {
                    linkSectionPermission: {
                      include: {
                        section: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error(`Erro ao buscar Usuários na om: ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar Usuários na OM',
    })
  }
})
