// noinspection JSUnusedGlobalSymbols

import type { userWithoutPassword } from '~/types/core/user'

export const useUserData = () => {
  const authStore = useAuthUserStore()

  return {
    currentUser: computed(() => authStore.user as userWithoutPassword),
    isLoading: computed(() => authStore.loading),
    isAuthenticated: computed(() => authStore.isAuthenticated),
  }
}
