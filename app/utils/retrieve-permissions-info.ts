import { PERMISSION_CATEGORIES } from '~/constants/permissions'

export const retrievePermissionInfo = (permission: string) => {
  for (const category of PERMISSION_CATEGORIES) {
    const foundPermission = category.permissions.find((perm) => perm.alias === permission)
    if (foundPermission) {
      return {
        module: category.module,
        module_color: category.module_color,
        description: foundPermission.description,
      }
    }
  }
  return null
}
