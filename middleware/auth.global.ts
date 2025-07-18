// middleware/auth.global.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { initializeAuth, clearSession } = useAuth()

  const publicPatterns = ['/', /^\/course\/.+/, '/about']

  const isPublicRoute = (path: string) => {
    return publicPatterns.some((pattern) =>
      pattern instanceof RegExp ? pattern.test(path) : pattern === path
    )
  }

  const isGoingToPublicRoute = isPublicRoute(to.path)

  if (to.path === from?.path) return

  try {
    const authTokenCookie = useCookie('auth-token')

    if (authTokenCookie.value) {
      const isValid = await initializeAuth()

      if (isValid) {
        if (isGoingToPublicRoute) {
          return navigateTo('/home')
        }
        return
      }
      clearSession()
    }

    if (isGoingToPublicRoute) {
      return
    }

    clearSession()
    return navigateTo('/')
  } catch (error) {
    console.error('Erro no middleware de auth:', error)
    clearSession()

    if (!isGoingToPublicRoute) {
      return navigateTo('/')
    }
  }
})
