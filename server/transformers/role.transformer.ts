import { BaseTransformer } from './base.transformer'
import { SectionTransformer } from './section.transformer'
import { PermissionTransformer } from './permission.transformer'
import type { RoleWithIncludes } from './types'

export class RoleTransformer extends BaseTransformer {
  static transform(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, section, permissions, ...cleanRole } = role

    return {
      ...cleanRole,
      ...(section && { section: SectionTransformer.transform(section) }),
      permissions: permissions.map(rolePermission =>
        PermissionTransformer.transform(rolePermission.permission)
      )
    }
  }

  static transformForAuth(role: RoleWithIncludes) {
    const { createdAt, updatedAt, deleted, section, permissions, ...cleanRole } = role

    return {
      ...cleanRole,
      ...(section && { section: SectionTransformer.transformForAuth(section) }),
      permissions: permissions.map(rolePermission =>
        PermissionTransformer.toSlug(rolePermission.permission)
      )
    }
  }

  static collection(roles: RoleWithIncludes[]) {
    return roles.map(role => this.transform(role))
  }
}
