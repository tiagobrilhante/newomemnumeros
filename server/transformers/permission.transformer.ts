import type { Permission } from '@prisma/client'
import { BaseTransformer } from './base.transformer'

export class PermissionTransformer extends BaseTransformer {
  static transform(permission: Permission) {
    return this.removeAuditFields(permission)
  }

  static collection(permissions: Permission[]) {
    return this.removeAuditFieldsFromCollection(permissions)
  }

  static toSlug(permission: Permission): string {
    return permission.slug
  }

  static toSlugs(permissions: Permission[]): string[] {
    return permissions.map(permission => permission.slug)
  }
}
