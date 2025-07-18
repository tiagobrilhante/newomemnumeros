import { defineStore } from 'pinia'
import type { user, userWithoutPassword } from '~/types/core/user'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore( 'auth',
  {
    state: () => ({
      user: null as user | null,
    }),

    actions: {
      setUser(userData: user) {
        this.user = userData
      },

      clearUser() {
        this.user = null
      },

      updateUser(userData: Partial<userWithoutPassword>) {
        if (this.user) {
          this.user = { ...this.user, ...userData } as user
        }
      }
    },
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  })

