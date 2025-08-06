import prisma from '../prisma'
import { handleError } from '../utils/errorHandler'
import { RoleTransformer } from '../transformers/role.transformer'
import { sanitizeData } from '#shared/utils'
import { serverTByLocale } from '../utils/i18n'
import { createError } from 'h3'
import type { Role } from '#shared/types/role'

interface RoleCreateInput {
  name: string
  acronym: string
  militaryOrganizationId?: string | null
}

interface RoleUpdateInput {
  name?: string
  acronym?: string
  militaryOrganizationId?: string | null
}

function sanitizeRoleData(name: string, acronym: string) {
  const sanitizedData = sanitizeData({ name, acronym })
  const sanitizedName = sanitizedData.name
  const sanitizedAcronym = sanitizedData.acronym // Manter case original
  return { sanitizedName, sanitizedAcronym }
}

export async function getAllRoles(locale: string): Promise<Role[]> {
  try {
    const roles = await prisma.role.findMany({
      where: {
        deleted: false,
      },
      include: {
        militaryOrganization: true,
        permissions: {
          include: {
            permission: true
          }
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
    })

    return RoleTransformer.collection(roles)
  } catch (error) {
    throw await handleError(error, locale, 'GET_ALL_ROLES')
  }
}

export async function getRoleById(id: string, locale: string): Promise<Role> {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id,
        deleted: false,
      },
      include: {
        militaryOrganization: true,
        permissions: {
          include: {
            permission: true
          }
        },
      },
    })

    if (!role) {
      throw createError({
        statusCode: 404,
        statusMessage: await serverTByLocale(locale, 'errors.roleNotFound', 'Role not found')
      })
    }

    return RoleTransformer.single(role)
  } catch (error) {
    throw await handleError(error, locale, 'GET_ROLE_BY_ID')
  }
}

export async function getRolesByOrganization(organizationId: string, locale: string): Promise<Role[]> {
  try {
    // Verificar se a organização existe
    const organization = await prisma.militaryOrganization.findUnique({
      where: {
        id: organizationId,
        deleted: false,
      },
    })

    if (!organization) {
      throw createError({
        statusCode: 404,
        statusMessage: await serverTByLocale(locale, 'errors.organizationNotFound', 'Organization not found')
      })
    }

    const roles = await prisma.role.findMany({
      where: {
        militaryOrganizationId: organizationId,
        deleted: false,
      },
      include: {
        militaryOrganization: true,
        permissions: {
          include: {
            permission: true
          }
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
    })

    return RoleTransformer.collection(roles)
  } catch (error) {
    throw await handleError(error, locale, 'GET_ROLES_BY_ORGANIZATION')
  }
}

export async function createRole(data: RoleCreateInput, locale: string): Promise<Role> {
  try {
    const { sanitizedName, sanitizedAcronym } = sanitizeRoleData(data.name, data.acronym)

    // Verificar se já existe um role com o mesmo nome na organização (ou globalmente se for global)
    const existingRole = await prisma.role.findFirst({
      where: {
        OR: [
          { name: sanitizedName },
          { acronym: sanitizedAcronym }
        ],
        militaryOrganizationId: data.militaryOrganizationId || null,
        deleted: false,
      },
    })

    if (existingRole) {
      throw createError({
        statusCode: 400,
        statusMessage: await serverTByLocale(locale, 'errors.roleAlreadyExists', 'Role with this name or acronym already exists')
      })
    }

    // Se militaryOrganizationId for fornecido, verificar se a organização existe
    if (data.militaryOrganizationId) {
      const organization = await prisma.militaryOrganization.findUnique({
        where: {
          id: data.militaryOrganizationId,
          deleted: false,
        },
      })

      if (!organization) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.organizationNotFound', 'Organization not found')
        })
      }
    }

    const newRole = await prisma.role.create({
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        militaryOrganizationId: data.militaryOrganizationId,
      },
      include: {
        militaryOrganization: true,
        permissions: {
          include: {
            permission: true
          }
        },
      },
    })

    return RoleTransformer.single(newRole)
  } catch (error) {
    throw await handleError(error, locale, 'CREATE_ROLE')
  }
}

export async function updateRole(id: string, data: RoleUpdateInput, locale: string): Promise<Role> {
  try {
    // Verificar se o role existe
    const existingRole = await prisma.role.findUnique({
      where: {
        id,
        deleted: false,
      },
    })

    if (!existingRole) {
      throw createError({
        statusCode: 404,
        statusMessage: await serverTByLocale(locale, 'errors.roleNotFound', 'Role not found')
      })
    }

    let sanitizedName = existingRole.name
    let sanitizedAcronym = existingRole.acronym

    // Sanitizar dados se fornecidos
    if (data.name || data.acronym) {
      const sanitized = sanitizeRoleData(
        data.name || existingRole.name,
        data.acronym || existingRole.acronym
      )
      sanitizedName = sanitized.sanitizedName
      sanitizedAcronym = sanitized.sanitizedAcronym
    }

    // Verificar se já existe outro role com o mesmo nome/acronym na mesma organização
    if (data.name || data.acronym || data.militaryOrganizationId !== undefined) {
      const targetOrganizationId = data.militaryOrganizationId !== undefined 
        ? data.militaryOrganizationId 
        : existingRole.militaryOrganizationId

      const duplicateRole = await prisma.role.findFirst({
        where: {
          OR: [
            { name: sanitizedName },
            { acronym: sanitizedAcronym }
          ],
          militaryOrganizationId: targetOrganizationId,
          deleted: false,
          NOT: { id }, // Excluir o próprio role da verificação
        },
      })

      if (duplicateRole) {
        throw createError({
          statusCode: 400,
          statusMessage: await serverTByLocale(locale, 'errors.roleAlreadyExists', 'Role with this name or acronym already exists')
        })
      }
    }

    // Se militaryOrganizationId for fornecido, verificar se a organização existe
    if (data.militaryOrganizationId) {
      const organization = await prisma.militaryOrganization.findUnique({
        where: {
          id: data.militaryOrganizationId,
          deleted: false,
        },
      })

      if (!organization) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.organizationNotFound', 'Organization not found')
        })
      }
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        militaryOrganizationId: data.militaryOrganizationId !== undefined 
          ? data.militaryOrganizationId 
          : existingRole.militaryOrganizationId,
      },
      include: {
        militaryOrganization: true,
        permissions: {
          include: {
            permission: true
          }
        },
      },
    })

    return RoleTransformer.single(updatedRole)
  } catch (error) {
    throw await handleError(error, locale, 'UPDATE_ROLE')
  }
}

export async function deleteRole(id: string, locale: string): Promise<void> {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id,
        deleted: false,
      },
    })

    if (!role) {
      throw createError({
        statusCode: 404,
        statusMessage: await serverTByLocale(locale, 'errors.roleNotFound', 'Role not found')
      })
    }

    // Verificar se existem usuários usando este role
    const usersWithRole = await prisma.user.count({
      where: {
        roleId: id,
        deleted: false,
      },
    })

    if (usersWithRole > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: await serverTByLocale(locale, 'errors.roleInUse', 'Cannot delete role that is assigned to users')
      })
    }

    // Soft delete
    await prisma.role.update({
      where: { id },
      data: { deleted: true },
    })
  } catch (error) {
    throw await handleError(error, locale, 'DELETE_ROLE')
  }
}