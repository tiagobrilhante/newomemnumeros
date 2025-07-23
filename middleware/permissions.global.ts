import { routePermissionsMap } from '~/config/routes'

export default defineNuxtRouteMiddleware((to) => {
  // Só processa se o usuário está autenticado
  const authStore = useAuthUserStore()
  if (!authStore.isAuthenticated) {
    return
  }

  // Verifica se a rota requer permissões específicas
  const requiredPermissions = routePermissionsMap[to.path]
  if (!requiredPermissions) {
    return // Rota não protegida ou não mapeada
  }

  // Usa o composable para verificar permissões
  const { hasRoutePermission } = usePermissions()
  
  if (!hasRoutePermission(to.path, requiredPermissions)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado. Você não tem permissão para acessar esta página.'
    })
  }
})