import basePrisma from '../../lib/prisma'

const prisma = basePrisma.$extends({
  query: {
    user: {
      delete: async ({ args }) => {
        return basePrisma.user.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        return basePrisma.user.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    rank: {
      delete: async ({ args }) => {
        return basePrisma.rank.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        return basePrisma.rank.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    militaryOrganization: {
      delete: async ({ args }) => {
        await basePrisma.section.updateMany({
          where: { militaryOrganizationId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.militaryOrganization.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        let ids: string[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'string') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.section.updateMany({
            where: { militaryOrganizationId: { in: ids } },
            data: { deleted: true },
          })
        }

        return basePrisma.militaryOrganization.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    section: {
      delete: async ({ args }) => {
        await basePrisma.role.updateMany({
          where: { sectionId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.section.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        let ids: string[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'string') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.role.updateMany({
            where: { sectionId: { in: ids } },
            data: { deleted: true },
          })
        }

        return basePrisma.section.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    role: {
      delete: async ({ args }) => {
        await basePrisma.rolePermission.updateMany({
          where: { roleId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.user.updateMany({
          where: { roleId: args.where.id },
          data: { roleId: null },
        })

        return basePrisma.role.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        let ids: string[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'string') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.rolePermission.updateMany({
            where: { roleId: { in: ids } },
            data: { deleted: true },
          })

          await basePrisma.user.updateMany({
            where: { roleId: { in: ids } },
            data: { roleId: null },
          })
        }

        return basePrisma.role.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    permission: {
      delete: async ({ args }) => {
        await basePrisma.rolePermission.updateMany({
          where: { permissionId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.permission.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        let ids: string[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'string') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.rolePermission.updateMany({
            where: { permissionId: { in: ids } },
            data: { deleted: true },
          })
        }

        return basePrisma.permission.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },

    rolePermission: {
      delete: async ({ args }) => {
        return basePrisma.rolePermission.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        return basePrisma.rolePermission.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
      findMany: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findFirst: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
      findUnique: async ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deleted: false,
          },
        })
      },
    },
  },
})

export default prisma
