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
      const response = await authService.register(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro inesperado no registro'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearClientStorage = () => {
    // Limpar cookies apenas no cliente
    if (import.meta.client) {
      try {
        // Limpar cookie auth
        document.cookie = 'auth=; Max-Age=0; path=/; SameSite=strict'

        // Limpar cookie auth-token
        document.cookie = 'auth-token=; Max-Age=0; path=/; SameSite=strict'

        // Limpar localStorage e sessionStorage
        localStorage.removeItem('auth')
        sessionStorage.removeItem('auth')
      } catch (e) {
        console.error('Erro ao limpar cookies/storage:', e)
      }
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      authStore.clearUser()
      clearClientStorage()
      loading.value = false
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
      authStore.clearUser()
      clearClientStorage()
      return false
    } finally {
      loading.value = false
    }
  }

  const checkAccess = async () => {
    try {
      const response = await authService.checkAccess()
      if (!response.hasAccess) {
        authStore.clearUser()
        clearClientStorage()
      }
      return response.hasAccess
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao verificar acesso'
      authStore.clearUser()
      clearClientStorage()
      return false
    }
  }

  const initializeAuth = async () => {
    if (authStore.isAuthenticated) {
      return true
    }

    // Verificar se há token via document.cookie em vez de useCookie
    if (import.meta.client) {
      const cookies = document.cookie.split(';')
      const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
      if (!authTokenCookie) {
        return false
      }
    }

    return await verifyToken()
  }

  const clearSession = () => {
    authStore.clearUser()
    clearClientStorage()
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
    clearSession
  }
}