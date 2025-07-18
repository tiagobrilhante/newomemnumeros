import { defineStore } from 'pinia'
import type { user, userWithoutPassword } from '~/types/core/user'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore(
  'auth',
  () => {
    const user = ref<user | null>(null)

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
      console.log('dentro do store eu tenho')
      console.log(userData)
      user.value = userData
      console.log('user.value')
      console.log(user.value)
      console.log('user.value')
    }

    function clearUser() {
      user.value = null
    }

    function updateUser(userData: Partial<userWithoutPassword>) {
      if (user.value) {
        user.value = { ...user.value, ...userData } as user
      }
    }

    return {
      user,
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
    persist: true,
  },
)
