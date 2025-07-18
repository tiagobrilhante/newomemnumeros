import { authService } from '~/services/auth.service'
import { useAuthUserStore } from '~/stores/auth.store'
import type { loginCredentials, registerData } from '~/types/auth'

export const useAuth = () => {
  const authStore = useAuthUserStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: loginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response?.user) {
        authStore.setUser(response.user)
        return { success: true }
      } else {
        error.value = 'Dados de login inválidos ou incompletos'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro inesperado na autenticação'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (data: registerData) => {
    loading.value = true
    error.value = null

    try {
      return await authService.register(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro inesperado no registro'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }


  const logout = async () => {
    try {
      await authService.logout()
      authStore.$reset()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      // Mesmo com erro no servidor, limpar o estado local
      authStore.$reset()
    } finally {
      await navigateTo('/', { external: true })
    }
  }

  const verifyToken = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.verifyToken()
      if (response?.user) {
        authStore.setUser(response.user)
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Token inválido'
      authStore.$reset()
      return false
    } finally {
      loading.value = false
    }
  }

  const checkAccess = async () => {
    try {
      const response = await authService.checkAccess()
      if (!response.hasAccess) {
        authStore.$reset()

      }
      return response.hasAccess
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao verificar acesso'
      authStore.$reset()
      return false
    }
  }

  const initializeAuth = async () => {
    // Apenas chama o verifyToken. A API no servidor que vai validar o cookie httpOnly.
    // O navegador envia o cookie automaticamente.
    return await verifyToken()
  }

  const clearSession = () => {
    authStore.$reset()
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    login,
    register,
    logout,
    verifyToken,
    checkAccess,
    initializeAuth,
    clearSession,
  }
}
