import { BaseTransformer } from './base.transformer'
import { PermissionTransformer } from './permission.transformer'
import type { RoleWithIncludes } from './types'

export class RoleTransformer extends BaseTransformer {
  static transform(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, roleMilitaryOrganization, permissions, ...cleanRole } = role

    // Obter militaryOrganization via roleMilitaryOrganization pivot
    const militaryOrganizations = roleMilitaryOrganization?.map(rmo => rmo.militaryOrganization).filter(Boolean) || []

    return {
      ...cleanRole,
      ...(militaryOrganizations.length > 0 && { 
        militaryOrganizations: militaryOrganizations.map(mo => ({
          id: mo.id,
          name: mo.name,
          acronym: mo.acronym,
          color: mo.color,
          logo: mo.logo
        }))
      }),
      permissions: permissions.map(rolePermission => ({
        id: rolePermission.id,
        permissionId: rolePermission.permissionId,
        roleId: rolePermission.roleId,
        permission: PermissionTransformer.transform(rolePermission.permission)
      }))
    }
  }

  static transformForAuth(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, roleMilitaryOrganization, permissions, ...cleanRole } = role

    // Obter militaryOrganization via roleMilitaryOrganization pivot
    const militaryOrganizations = roleMilitaryOrganization?.map(rmo => rmo.militaryOrganization).filter(Boolean) || []

    return {
      ...cleanRole,
      ...(militaryOrganizations.length > 0 && { 
        militaryOrganizations: militaryOrganizations.map(mo => ({
          id: mo.id,
          name: mo.name,
          acronym: mo.acronym,
          color: mo.color,
          logo: mo.logo
        }))
      }),
      permissions: permissions.map(rolePermission =>
        PermissionTransformer.toSlug(rolePermission.permission)
      )
    }
  }

  static collection(roles: RoleWithIncludes[]) {
    return roles.map(role => this.transform(role))
  }
}
