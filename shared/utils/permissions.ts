import type { Role } from '#shared/types/role'

/**
 * Permissões que tornam uma role global
 * Baseadas nas constantes de permissions.ts
 */
export const GLOBAL_PERMISSIONS = [
  'global.system.manage',      // Super admin do sistema
  'global.organization.manage' // Admin de organização militar
] as const

/**
 * Verifica se uma role é global baseada em suas permissões
 *
 * @param role - Role para verificar
 * @returns true se a role possui permissões que a tornam global
 */
export function isGlobalRole(role: Role): boolean {
  if (!role.permissions || role.permissions.length === 0) {
    return false
  }

  return role.permissions.some(rolePermission =>
    (GLOBAL_PERMISSIONS as readonly string[]).includes(rolePermission.permission.slug)
  )
}

/**
 * Separa roles em globais e organizacionais
 *
 * @param roles - Array de roles
 * @returns Objeto com roles globais e não globais
 */
export function separateRolesByType(roles: Role[]) {
  const globalRoles: Role[] = []
  const organizationalRoles: Role[] = []

  roles.forEach(role => {
    if (isGlobalRole(role)) {
      globalRoles.push(role)
    } else {
      organizationalRoles.push(role)
    }
  })

  return {
    globalRoles,
    organizationalRoles
  }
}

/**
 * Filtra roles organizacionais por organização específica
 *
 * @param roles - Array de roles
 * @param organizationId - ID da organização
 * @returns Roles vinculadas à organização (excluindo globais)
 */
export function getOrganizationRoles(roles: Role[], organizationId: string): Role[] {
  return roles.filter(role => {
    // Exclui roles globais
    if (isGlobalRole(role)) {
      return false
    }

    // Verifica se está vinculada à organização
    return role.militaryOrganizations?.some(mo => mo.id === organizationId)
  })
}
