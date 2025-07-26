import { authService } from '~/services/auth.service'
import { useAuthUserStore } from '~/stores/auth.store'
import type { ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { createAppError } from '~/utils/clientErrorHandler'

// noinspection JSUnusedGlobalSymbols
export const useAuth = () => {
  const authStore = useAuthUserStore()
  const { $i18n } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getTranslatedMessage = (key: string, fallback: string): string => {
    try {
      return $i18n?.t(key) || fallback
    } catch {
      return fallback
    }
  }

  const login = async (credentials: loginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response?.user) {
        authStore.setUser(response.user)
        return { success: true }
      } else {
        const message = getTranslatedMessage('errors.invalidDataProvided', 'Dados de login inválidos ou incompletos')
        error.value = message
        return { success: false, error: message }
      }
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : getTranslatedMessage('errorUnexpected', 'Erro inesperado na autenticação')
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      createAppError('errors.serverCommunication', {
        statusCode: 500,
        statusMessageKey: 'errors.serverCommunication',
        fallbackStatusMessage: 'Logout Error',
        fallbackMessage: 'Erro ao fazer logout',
      } satisfies ErrorHandlerOptions)
    } finally {
      authStore.$reset()
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
      error.value = err instanceof Error
        ? err.message
        : getTranslatedMessage('errors.invalidToken', 'Token inválido')
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
      error.value = err instanceof Error
        ? err.message
        : getTranslatedMessage('errors.accessDenied', 'Erro ao verificar acesso')
      authStore.$reset()
      return false
    }
  }

  const initializeAuth = async () => {
    return await verifyToken()
  }

  const clearSession = () => {
    authStore.$reset()
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    verifyToken,
    checkAccess,
    initializeAuth,
    clearSession,
  }
}
