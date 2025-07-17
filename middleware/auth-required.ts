export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthUserStore()
  
  // Verificar cookies
  const authTokenCookie = useCookie('auth-token')
  const authCookie = useCookie('auth')
  const hasAuthTokenCookie = !!authTokenCookie.value
  const hasAuthCookie = !!authCookie.value
  
  // Se não tem nenhum cookie de autenticação, bloquear acesso
  if (!hasAuthCookie && !hasAuthTokenCookie) {
    return navigateTo('/')
  }
  
  // Se não está autenticado na store, bloquear acesso
  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }
  
})