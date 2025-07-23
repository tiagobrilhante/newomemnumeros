import type { RouteConfig } from '~/config/routes'

export const usePermissions = () => {
  const authStore = useAuthUserStore()

  const hasPermission = (item: RouteConfig | { accessLevel?: string[], requiresAuth?: boolean }): boolean => {
    if (!item) return false

    const user = authStore.user
    if (!user) return false
    
    if (item.requiresAuth && !item.accessLevel) {
      return true
    }
    
    if (!item.accessLevel || item.accessLevel.length === 0) {
      return true
    }
    
    const userPermissions = user.role?.permissions || []

    if (userPermissions.includes('system.admin')) {
      return true
    }
    
    return item.accessLevel.some(permission =>
      userPermissions.includes(permission)
    )
  }

  const hasRoutePermission = (routePath: string, requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const user = authStore.user
    if (!user) return false

    const userPermissions = user.role?.permissions || []

    if (userPermissions.includes('system.admin')) {
      return true
    }

    return requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    )
  }

  return {
    hasPermission,
    hasRoutePermission
  }
}