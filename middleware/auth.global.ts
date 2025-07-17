import { useAuthUserStore } from '~/stores/auth.store'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthUserStore()
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

  // Se estamos na página de login ou rota pública e não há token, deixa passar
  const isGoingToPublicRoute = isPublicRoute(to.path)

  try {
    // Verificar se existem ambos os cookies
    const authTokenCookie = useCookie('auth-token')
    const authCookie = useCookie('auth')
    const hasAuthTokenCookie = !!authTokenCookie.value
    const hasAuthCookie = !!authCookie.value


    // Se não tem NENHUM cookie (nem auth nem auth-token) e está tentando acessar rota protegida
    if (!hasAuthCookie && !hasAuthTokenCookie && !isGoingToPublicRoute) {
      return navigateTo('/')
    }

    // Se não há cookie auth (store) e tentando acessar rota protegida
    if (!hasAuthCookie && !isGoingToPublicRoute) {
      return navigateTo('/')
    }

    // Se há cookie auth (store), verificar se o usuário está autenticado
    if (hasAuthCookie) {
      // Adicionando proteção contra loop - verificar se já estamos tentando redirecionar para login
      if (to.path === '/' && from?.path && !isPublicRoute(from.path)) {
        // Provavelmente já estamos no processo de redirecionamento para login
        return
      }

      // Se o usuário está autenticado na store, permitir acesso
      if (authStore.isAuthenticated) {
        if (isGoingToPublicRoute) {
          // Usuário autenticado redirecionado de rota pública para home
          return navigateTo('/home')
        }
        // Usuário autenticado acessando rota privada
        return
      }

      // Se tem cookie auth mas não está autenticado na store, redirecionar imediatamente para home
      // se está tentando acessar rota pública (evita flickering)
      if (isGoingToPublicRoute && hasAuthTokenCookie) {
        return navigateTo('/home')
      }

      // Se não está autenticado na store, tentar inicializar apenas se há token no servidor
      try {
        // Verificar se há token no servidor antes de tentar inicializar
        const authTokenCookie = useCookie('auth-token')
        if (!authTokenCookie.value) {
          // Se não há token no servidor, não tentar inicializar
        } else {
          const isValid = await authStore.initializeAuth()

          if (isValid) {
            if (isGoingToPublicRoute) {
              // Usuário autenticado redirecionado de rota pública para home
              return navigateTo('/home')
            }
            // Usuário autenticado acessando rota privada
            return
          }
        }
      } catch (error) {
        // Se falhar a inicialização, limpar tudo
      }

      // Token inválido ou erro na inicialização, limpar sessão
      authStore.clearSession()

      // Remover cookie manualmente (isso é crucial)
      authCookie.value = null

      if (!isGoingToPublicRoute) {
        return navigateTo('/')
      }
    }

    // Se não estiver autenticado e tentando acessar rota protegida
    if (!isGoingToPublicRoute) {
      return navigateTo('/')
    }

    return
  } catch (error) {
    console.error('Auth middleware error:', error)

    // Em caso de erro, garantir limpeza completa
    authStore.clearSession()
    const authCookie = useCookie('auth')
    authCookie.value = null

    if (!isGoingToPublicRoute) {
      return navigateTo('/')
    }
  }
})
