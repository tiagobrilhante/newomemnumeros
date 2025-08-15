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
  militaryOrganizationIds?: string[] // IDs das OMs para vincular (opcional)
  sectionIds?: string[] // IDs das seções para vincular (opcional)
  permissionIds?: string[] // IDs das permissões para vincular (opcional)
  // Se for um OM Admin criando, será auto-vinculada à sua OM
}

interface RoleUpdateInput {
  name?: string
  acronym?: string
  militaryOrganizationIds?: string[] // IDs das OMs para vincular (opcional)
  sectionIds?: string[] // IDs das seções para vincular (opcional) 
  permissionIds?: string[] // IDs das permissões para vincular (opcional)
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
        roleMilitaryOrganization: {
          include: {
            militaryOrganization: true
          }
        },
        roleSection: {
          include: {
            section: true
          }
        },
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
        roleMilitaryOrganization: {
          include: {
            militaryOrganization: true
          }
        },
        roleSection: {
          include: {
            section: true
          }
        },
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
        roleMilitaryOrganization: {
          some: {
            militaryOrganizationId: organizationId
          }
        },
        deleted: false,
      },
      include: {
        roleMilitaryOrganization: {
          include: {
            militaryOrganization: true
          }
        },
        roleSection: {
          include: {
            section: true
          }
        },
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

export async function createRole(
  data: RoleCreateInput, 
  locale: string, 
  currentUserId?: string
): Promise<Role> {
  try {
    const { sanitizedName, sanitizedAcronym } = sanitizeRoleData(data.name, data.acronym)

    // Verificar duplicatas (busca global pois roles podem ser flexíveis)
    const existingRole = await prisma.role.findFirst({
      where: {
        OR: [
          { name: sanitizedName },
          { acronym: sanitizedAcronym }
        ],
        deleted: false,
      },
    })

    if (existingRole) {
      throw createError({
        statusCode: 400,
        statusMessage: await serverTByLocale(locale, 'errors.roleAlreadyExists', 'Role with this name or acronym already exists')
      })
    }

    // Verificar se organizações existem (se fornecidas)
    if (data.militaryOrganizationIds && data.militaryOrganizationIds.length > 0) {
      const organizations = await prisma.militaryOrganization.findMany({
        where: {
          id: { in: data.militaryOrganizationIds },
          deleted: false,
        },
      })

      if (organizations.length !== data.militaryOrganizationIds.length) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.organizationNotFound', 'One or more organizations not found')
        })
      }
    }

    // Verificar se seções existem (se fornecidas)
    if (data.sectionIds && data.sectionIds.length > 0) {
      const sections = await prisma.section.findMany({
        where: {
          id: { in: data.sectionIds },
          deleted: false,
        },
      })

      if (sections.length !== data.sectionIds.length) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.sectionNotFound', 'One or more sections not found')
        })
      }
    }

    // Roles são criadas como templates globais por padrão
    // A vinculação com organizações é feita separadamente via interface
    const finalMilitaryOrganizationIds = data.militaryOrganizationIds || []

    // Usar transação para criar role e relacionamentos
    const newRole = await prisma.$transaction(async (tx) => {
      // Criar o role
      const role = await tx.role.create({
        data: {
          name: sanitizedName,
          acronym: sanitizedAcronym,
        },
      })

      // Criar relacionamentos com organizações
      if (finalMilitaryOrganizationIds.length > 0) {
        await tx.roleMilitaryOrganization.createMany({
          data: finalMilitaryOrganizationIds.map(orgId => ({
            roleId: role.id,
            militaryOrganizationId: orgId
          })),
        })
      }

      // Criar relacionamentos com seções
      if (data.sectionIds && data.sectionIds.length > 0) {
        await tx.roleSection.createMany({
          data: data.sectionIds.map(sectionId => ({
            roleId: role.id,
            sectionId
          })),
        })
      }

      // Criar relacionamentos com permissões
      if (data.permissionIds && data.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permissionIds.map(permissionId => ({
            roleId: role.id,
            permissionId
          })),
        })
      }

      // Buscar o role completo com includes
      return await tx.role.findUnique({
        where: { id: role.id },
        include: {
          roleMilitaryOrganization: {
            include: {
              militaryOrganization: true
            }
          },
          roleSection: {
            include: {
              section: true
            }
          },
          permissions: {
            include: {
              permission: true
            }
          },
        },
      })
    })

    if (!newRole) {
      throw createError({
        statusCode: 500,
        statusMessage: await serverTByLocale(locale, 'errors.createRole', 'Failed to create role')
      })
    }

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

    // Verificar duplicatas (busca global)
    if (data.name || data.acronym) {
      const duplicateRole = await prisma.role.findFirst({
        where: {
          OR: [
            { name: sanitizedName },
            { acronym: sanitizedAcronym }
          ],
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

    // Verificar se organizações existem (se fornecidas)
    if (data.militaryOrganizationIds && data.militaryOrganizationIds.length > 0) {
      const organizations = await prisma.militaryOrganization.findMany({
        where: {
          id: { in: data.militaryOrganizationIds },
          deleted: false,
        },
      })

      if (organizations.length !== data.militaryOrganizationIds.length) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.organizationNotFound', 'One or more organizations not found')
        })
      }
    }

    // Verificar se seções existem (se fornecidas)
    if (data.sectionIds && data.sectionIds.length > 0) {
      const sections = await prisma.section.findMany({
        where: {
          id: { in: data.sectionIds },
          deleted: false,
        },
      })

      if (sections.length !== data.sectionIds.length) {
        throw createError({
          statusCode: 404,
          statusMessage: await serverTByLocale(locale, 'errors.sectionNotFound', 'One or more sections not found')
        })
      }
    }

    // Usar transação para atualizar role e relacionamentos
    const updatedRole = await prisma.$transaction(async (tx) => {
      // Atualizar dados básicos do role
      await tx.role.update({
        where: { id },
        data: {
          name: sanitizedName,
          acronym: sanitizedAcronym,
        },
      })

      // Atualizar relacionamentos com organizações (se fornecidos)
      if (data.militaryOrganizationIds !== undefined) {
        // Remover relacionamentos existentes
        await tx.roleMilitaryOrganization.deleteMany({
          where: { roleId: id }
        })

        // Criar novos relacionamentos
        if (data.militaryOrganizationIds.length > 0) {
          await tx.roleMilitaryOrganization.createMany({
            data: data.militaryOrganizationIds.map(orgId => ({
              roleId: id,
              militaryOrganizationId: orgId
            })),
          })
        }
      }

      // Atualizar relacionamentos com seções (se fornecidos)
      if (data.sectionIds !== undefined) {
        // Remover relacionamentos existentes
        await tx.roleSection.deleteMany({
          where: { roleId: id }
        })

        // Criar novos relacionamentos
        if (data.sectionIds.length > 0) {
          await tx.roleSection.createMany({
            data: data.sectionIds.map(sectionId => ({
              roleId: id,
              sectionId
            })),
          })
        }
      }

      // Atualizar relacionamentos com permissões (se fornecidos)
      if (data.permissionIds !== undefined) {
        // Remover relacionamentos existentes
        await tx.rolePermission.deleteMany({
          where: { roleId: id }
        })

        // Criar novos relacionamentos
        if (data.permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: data.permissionIds.map(permissionId => ({
              roleId: id,
              permissionId
            })),
          })
        }
      }

      // Buscar o role completo atualizado
      return await tx.role.findUnique({
        where: { id },
        include: {
          roleMilitaryOrganization: {
            include: {
              militaryOrganization: true
            }
          },
          roleSection: {
            include: {
              section: true
            }
          },
          permissions: {
            include: {
              permission: true
            }
          },
        },
      })
    })

    if (!updatedRole) {
      throw createError({
        statusCode: 500,
        statusMessage: await serverTByLocale(locale, 'errors.updateRole', 'Failed to update role')
      })
    }

    return RoleTransformer.single(updatedRole)
  } catch (error) {
    throw await handleError(error, locale, 'UPDATE_ROLE')
  }
}

export async function getRoleUsage(id: string, locale: string) {
  try {
    // Verificar se o role existe
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

    // Buscar organizações que usam esta role
    const organizationsUsingRole = await prisma.roleMilitaryOrganization.findMany({
      where: {
        roleId: id,
      },
      include: {
        militaryOrganization: true
      }
    })

    // Buscar usuários que têm esta role
    const usersWithRole = await prisma.user.findMany({
      where: {
        roleId: id,
        deleted: false,
      },
      include: {
        section: {
          include: {
            militaryOrganization: true
          }
        }
      }
    })

    // Buscar seções vinculadas a esta role
    const sectionsUsingRole = await prisma.roleSection.findMany({
      where: {
        roleId: id,
      },
      include: {
        section: {
          include: {
            militaryOrganization: true
          }
        }
      }
    })

    return {
      role,
      organizationsUsingRole: organizationsUsingRole
        .map(rmo => rmo.militaryOrganization)
        .filter(mo => mo && !mo.deleted),
      usersWithRole: usersWithRole.length,
      sectionsUsingRole: sectionsUsingRole
        .map(rs => rs.section)
        .filter(section => section && !section.deleted),
      isGlobal: organizationsUsingRole.length === 0 && sectionsUsingRole.length === 0
    }
  } catch (error) {
    throw await handleError(error, locale, 'GET_ROLE_USAGE')
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