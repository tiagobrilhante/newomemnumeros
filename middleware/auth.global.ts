import { useAuthUserStore } from '~/stores/auth.store'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthUserStore()
  const { initializeAuth, clearSession } = useAuth()
  const publicPatterns = ['/', /^\/course\/.+/, '/about']

  // Flag para evitar processamento durante redirecionamentos
  if (to.path === from?.path) {
    return
  }

  const isPublicRoute = (path: string) => {
    return publicPatterns.some((pattern) => {
      if (pattern instanceof RegExp) {
        return pattern.test(path)
      }
      return pattern === path
    })
  }

  const isGoingToPublicRoute = isPublicRoute(to.path)

  try {
    // Se o usuário já está autenticado na store
    if (authStore.isAuthenticated) {
      if (isGoingToPublicRoute) {
        // Usuário autenticado tentando acessar rota pública - redirecionar para home
        return navigateTo('/home')
      }
      // Usuário autenticado acessando rota privada - permitir
      return
    }

    // Se não está autenticado e está indo para rota pública, permitir
    if (isGoingToPublicRoute) {
      return
    }

    // Se não está autenticado e tentando acessar rota protegida
    // Tentar inicializar auth primeiro
    const authTokenCookie = useCookie('auth-token')
    if (authTokenCookie.value) {
      try {
        const isValid = await initializeAuth()
        if (isValid) {
          // Auth inicializada com sucesso, permitir acesso
          return
        }
      } catch (_error) {
        // Falha na inicialização
      }
    }

    // Não autenticado, redirecionar para login
    clearSession()
    return navigateTo('/')

  } catch (error) {
    console.error('Auth middleware error:', error)
    clearSession()
    
    if (!isGoingToPublicRoute) {
      return navigateTo('/')
    }
  }
})
