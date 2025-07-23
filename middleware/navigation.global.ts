export default defineNuxtRouteMiddleware((to, from) => {
  const navigationStore = useNavigationStore()
  
  // Só processa se o usuário está autenticado
  const authStore = useAuthUserStore()
  if (!authStore.isAuthenticated) {
    return
  }
  
  // Se está vindo de uma rota válida, salva na store
  if (from && from.path !== '/' && from.path !== '/home') {
    navigationStore.setCurrentPath(from.path)
  }
  
  // Se está indo para /home vindo do auth (reload/login), redireciona para último local
  // Mas se está vindo de outra página (clique manual), permite ir para home
  const isComingFromAuth = !from || from.path === '/' || from.path === '/home'
  if (to.path === '/home' && isComingFromAuth && navigationStore.atualPath && navigationStore.atualPath !== '/home') {
    return navigateTo(navigationStore.atualPath)
  }
  
  // Atualiza o caminho atual na store sempre
  navigationStore.setCurrentPath(to.path)
})