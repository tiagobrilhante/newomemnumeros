import prisma from '~/server/prisma'
import type { userWithoutPassword } from '~/types/user'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (_event): Promise<userWithoutPassword[]> => {
  try {
    const users = await prisma.user.findMany({
      where: {
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

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }) as userWithoutPassword[]
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar usuários',
    })
  }
})
