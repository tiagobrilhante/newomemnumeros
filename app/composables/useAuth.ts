import { authService } from '~/services/auth.service'
import { useAuthUserStore } from '~/stores/auth.store'
import type { loginCredentials } from '#shared/types/auth'

// noinspection JSUnusedGlobalSymbols
export const useAuth = () => {
  const authStore = useAuthUserStore()
  const isLoggingOut = ref(false)

  /**
   * Login com tratamento de erro aprimorado
   */
  const login = async (credentials: loginCredentials) => {
    try {
      const result = await authService.login(credentials)
      if (result?.user) {
        authStore.setUser(result.user)
        return { success: true, user: result.user }
      }
      return { success: false, error: 'Login failed' }
    } catch (error) {
      // Log específico para erros de login
      console.error('Login failed:', {
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      const errorMessage = error instanceof Error ? error.message : 'Credenciais inválidas'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Logout com delay para UX suave
   */
  const logout = async () => {
    isLoggingOut.value = true

    try {
      await authService.logout()
    } catch (err) {
      // Em caso de erro no logout, ainda limpa a sessão
      console.warn('Logout API failed, but clearing session anyway:', err)
    } finally {
      // Delay para UX suave
      setTimeout(() => {
        authStore.logout()
        isLoggingOut.value = false
        navigateTo('/')
      }, 500)
    }
  }

  /**
   * Verificação de token com tratamento específico
   */
  const verifyToken = async () => {
    try {
      const result = await authService.verifyToken()
      if (result?.user) {
        authStore.setUser(result.user)
        return true
      }
      return false
    } catch (error) {
      authStore.logout()
      return false
    }
  }

  /**
   * Verificação de acesso com tratamento específico
   */
  const checkAccess = async () => {
    try {
      const result = await authService.checkAccess()
      if (!result?.hasAccess) {
        authStore.logout()
        return false
      }
      return result.hasAccess
    } catch (error) {
      authStore.logout()
      return false
    }
  }

  /**
   * Inicialização de autenticação
   */
  const initializeAuth = async () => {
    return await verifyToken()
  }

  /**
   * Limpa sessão local
   */
  const clearSession = () => {
    authStore.logout()
  }

  // Computed properties para estado de autenticação
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  return {
    // State
    isAuthenticated,
    user,
    isLoggingOut: readonly(isLoggingOut),

    // Actions
    login,
    logout,
    verifyToken,
    checkAccess,
    initializeAuth,
    clearSession,
  }
}
