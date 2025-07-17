import { PrismaClient } from '@prisma/client'

// Add try/catch for initialization
let basePrisma: PrismaClient
try {
  basePrisma = new PrismaClient()
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  throw error
}

const prisma = basePrisma.$extends({
  query: {
    user: {
      delete: async ({ args }) => {
        await basePrisma.permissionSetupUser.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.sectionFunctionUser.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.cnh.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.user.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        await basePrisma.permissionSetupUser.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.sectionFunctionUser.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.cnh.updateMany({
          where: { userId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.user.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
    },

    militaryOrganization: {
      delete: async ({ args }) => {
        await basePrisma.user.updateMany({
          where: { militaryOrganizationId: args.where.id },
          data: { deleted: true },
        })

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
        let ids: number[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'number') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.user.updateMany({
            where: { militaryOrganizationId: { in: ids } },
            data: { deleted: true },
          })

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
    },

    permissionSetup: {
      delete: async ({ args }) => {
        await basePrisma.permission.updateMany({
          where: { permissionSetupId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.permissionSetup.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        let ids: number[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'number') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.permission.updateMany({
            where: { permissionSetupId: { in: ids } },
            data: { deleted: true },
          })
        }

        return basePrisma.permissionSetup.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
    },

    militaryVehicle: {
      delete: async ({ args }) => {
        if (!args.where) throw new Error('args.where is undefined')
        await basePrisma.militaryVehicleStatus.updateMany({
          where: { militaryVehicleId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.militaryVehicleOdometerValue.updateMany({
          where: { militaryVehicleId: args.where.id },
          data: { deleted: true },
        })

        await basePrisma.qRCode.updateMany({
          where: { militaryVehicleId: args.where.id },
          data: { deleted: true },
        })

        return basePrisma.militaryVehicle.update({
          where: args.where,
          data: { deleted: true },
        })
      },
      deleteMany: async ({ args }) => {
        if (!args.where) throw new Error('args.where is undefined')
        let ids: number[] = []

        const idFilter = args.where?.id

        if (typeof idFilter === 'number') {
          ids = [idFilter]
        } else if (typeof idFilter === 'object' && idFilter !== null && 'in' in idFilter) {
          ids = idFilter.in ?? []
        }

        if (ids.length > 0) {
          await basePrisma.militaryVehicleStatus.updateMany({
            where: { militaryVehicleId: { in: ids } },
            data: { deleted: true },
          })

          await basePrisma.militaryVehicleOdometerValue.updateMany({
            where: { militaryVehicleId: { in: ids } },
            data: { deleted: true },
          })

          await basePrisma.qRCode.updateMany({
            where: { militaryVehicleId: { in: ids } },
            data: { deleted: true },
          })
        }

        return basePrisma.militaryVehicle.updateMany({
          where: args.where,
          data: { deleted: true },
        })
      },
    },
  },
})

export default prisma
