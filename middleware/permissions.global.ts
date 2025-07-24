import { routePermissionsMap } from '~/config/routes'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthUserStore()
  if (!authStore.isAuthenticated) {
    return
  }

  const requiredPermissions = routePermissionsMap[to.path]
  if (!requiredPermissions) {
    return
  }

  const { hasRoutePermission } = usePermissions()

  if (!hasRoutePermission(to.path, requiredPermissions)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado. Você não tem permissão para acessar esta página.'
    })
  }
})
