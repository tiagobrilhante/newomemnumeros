import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'
import type { registerData } from '~/types/auth'
import type { user, userWithoutPassword } from '~/types/core/user'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore(
  'auth',
  () => {
    const user = ref<user | null>(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const initializationInProgress = ref(false)

    const currentUser = computed(() => user.value as userWithoutPassword)
    const militaryOrganization = computed(() => user.value?.role?.section?.militaryOrganization)
    const rank = computed(() => user.value?.rank)
    const role = computed(() => user.value?.role)
    const section = computed(() => user.value?.role?.section)
    const permissions = computed(() => user.value?.role?.permissions || [])

    const hasPermission = (permission: string) => {
      return permissions.value.includes(permission)
    }

    const hasAnyPermission = (permissionList: string[]) => {
      return permissionList.some(permission => permissions.value.includes(permission))
    }

    const hasAllPermissions = (permissionList: string[]) => {
      return permissionList.every(permission => permissions.value.includes(permission))
    }

    async function initializeAuth() {
      if (user.value && isAuthenticated.value && !initializationInProgress.value) {
        return true
      }

      if (initializationInProgress.value) {
        return false
      }

      initializationInProgress.value = true

      try {
        const { user: userData } = await authService.verifyToken()
        if (userData) {
          user.value = userData
          isAuthenticated.value = true
          initializationInProgress.value = false
          return true
        }

        clearSession()
        initializationInProgress.value = false
        return false
      } catch (err: unknown) {
        initializationInProgress.value = false

        if (
          err instanceof Error &&
          (err.message === 'Token expirado. Por favor, faça login novamente.' ||
            err.message === 'Não autorizado. Por favor, faça login novamente.' ||
            err.message.includes('Token'))
        ) {
          clearSession()
          return false
        }

        // Não registrar erros 401 no console (comportamento normal quando não autenticado)
        if (!(err instanceof Error && err.message.includes('Não autorizado'))) {
          try {
            handleError(err)
          } catch (innerError) {
            console.error('Inner auth error:', innerError)
          }
        } else {
          clearSession()
        }

        return false
      }
    }

    async function login(email: string, password: string) {
      loading.value = true
      error.value = null

      try {
        const response = await authService.login({ email, password })

        if (response?.user) {
          setSession(response.user)
          return { success: true }
        } else {
          error.value = 'Dados de login inválidos ou incompletos'

          clearSession()

          return {
            success: false,
            error: error.value,
          }
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro inesperado na autenticação'
        clearSession()

        return {
          success: false,
          error: error.value,
        }
      } finally {
        loading.value = false
      }
    }

    async function register(data: registerData) {
      loading.value = true
      error.value = null
      try {
        return await authService.register(data)
      } catch (err) {
        handleError(err)
        return { success: false, error: 'Erro desconhecido' }
      } finally {
        loading.value = false
      }
    }

    async function checkAccess() {
      if (!isAuthenticated.value) return false
      try {
        const { hasAccess } = await authService.checkAccess()
        if (!hasAccess) {
          clearSession()
        }
        return hasAccess
      } catch (err) {
        handleError(err)
        return false
      }
    }

    function setSession(userData: user) {
      user.value = userData
      isAuthenticated.value = true
      error.value = null
    }

    function clearSession() {
      user.value = null
      isAuthenticated.value = false
      error.value = null

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

    function handleError(err: unknown) {
      console.error('authUserStore error:', err)

      error.value = err instanceof Error ? err.message : 'Erro inesperado na autenticação'
      clearSession()

      return {
        success: false,
        error: error.value || 'Erro de autenticação',
      }
    }

    async function updateUser(userData: Partial<userWithoutPassword>) {
      if (user.value) {
        user.value = { ...user.value, ...userData } as user
      }
    }

    async function logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      } finally {
        clearSession()
      }
    }

    return {
      user,
      isAuthenticated,
      loading,
      error,
      currentUser,
      rank,
      role,
      section,
      militaryOrganization,
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      initializeAuth,
      login,
      register,
      checkAccess,
      clearSession,
      handleError,
      updateUser,
      logout,
    }
  },
  {
    persist: {
      key: 'auth',
      paths: ['user', 'isAuthenticated'],
      storage: {
        getItem: (key: string) => {
          if (import.meta.client) {
            const cookie = useCookie(key)
            return cookie.value ? cookie.value : null
          }
          return null
        },
        setItem: (key: string, value: string) => {
          if (import.meta.client) {
            const cookie = useCookie(key, {
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 * 7, // 7 dias
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            })
            cookie.value = value
          }
        },
        removeItem: (key: string) => {
          if (import.meta.client) {
            const cookie = useCookie(key)
            cookie.value = null
          }
        },
      },
    } as PersistenceOptions,
  },
)
