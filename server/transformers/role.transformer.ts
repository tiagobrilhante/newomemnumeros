import { BaseTransformer } from './base.transformer'
import { PermissionTransformer } from './permission.transformer'
import type { RoleWithIncludes } from './types'

export class RoleTransformer extends BaseTransformer {
  static transform(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, militaryOrganization, permissions, ...cleanRole } = role

    return {
      ...cleanRole,
      ...(militaryOrganization && { 
        militaryOrganization: {
          id: militaryOrganization.id,
          name: militaryOrganization.name,
          acronym: militaryOrganization.acronym,
          color: militaryOrganization.color,
          logo: militaryOrganization.logo
        }
      }),
      permissions: permissions.map(rolePermission =>
        PermissionTransformer.transform(rolePermission.permission)
      )
    }
  }

  static transformForAuth(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, militaryOrganization, permissions, ...cleanRole } = role

    return {
      ...cleanRole,
      ...(militaryOrganization && { 
        militaryOrganization: {
          id: militaryOrganization.id,
          name: militaryOrganization.name,
          acronym: militaryOrganization.acronym,
          color: militaryOrganization.color,
          logo: militaryOrganization.logo
        }
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
