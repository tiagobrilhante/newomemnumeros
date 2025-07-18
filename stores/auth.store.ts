import { defineStore } from 'pinia'
import type { user, userWithoutPassword } from '~/types/core/user'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore(
  'auth',
  () => {
    const user = ref<user | null>(null)
    const isAuthenticated = ref(false)

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

    function setUser(userData: user) {
      user.value = userData
      isAuthenticated.value = true
    }

    function clearUser() {
      user.value = null
      isAuthenticated.value = false
    }

    function updateUser(userData: Partial<userWithoutPassword>) {
      if (user.value) {
        user.value = { ...user.value, ...userData } as user
      }
    }

    return {
      user,
      isAuthenticated,
      currentUser,
      rank,
      role,
      section,
      militaryOrganization,
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      setUser,
      clearUser,
      updateUser,
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
