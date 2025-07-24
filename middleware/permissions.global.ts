import { routePermissionsMap } from '~/config/routes'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthUserStore()
  if (!authStore.isAuthenticated) {
    return
  }

  const cleanPath = to.path.replace(/^\/[a-z]{2}-[A-Z]{2}/, '') || '/'

  const requiredPermissions = routePermissionsMap[cleanPath]
  if (!requiredPermissions) {
    return
  }

  const { hasRoutePermission } = usePermissions()
  const hasAccess = hasRoutePermission(cleanPath, requiredPermissions)

  if (!hasAccess) {
    throw createForbiddenError('errors.accessDenied')
  }
})
