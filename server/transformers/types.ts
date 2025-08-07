import type { Prisma } from '@prisma/client'

// Tipos compartilhados para os Resources
export type UserWithIncludes = Prisma.UserGetPayload<{
  include: {
    rank: true
    role: {
      include: {
        RoleMilitaryOrganization: {
          include: {
            militaryOrganization: true
          }
        }
        permissions: {
          include: {
            permission: true
          }
        }
      }
    }
    section: {
      include: {
        militaryOrganization: true
      }
    }
  }
}>

export type RoleWithIncludes = Prisma.RoleGetPayload<{
  include: {
    RoleMilitaryOrganization: {
      include: {
        militaryOrganization: true
      }
    }
    permissions: {
      include: {
        permission: true
      }
    }
  }
}>

export type SectionWithIncludes = Prisma.SectionGetPayload<{
  include: {
    militaryOrganization: true
  }
}>

export type RankWithIncludes = Prisma.RankGetPayload<{}>

export type PermissionWithIncludes = Prisma.PermissionGetPayload<{}>

export type MilitaryOrganizationWithIncludes = Prisma.MilitaryOrganizationGetPayload<{}>
