import { defineStore } from 'pinia'
import type { user, userWithoutPassword } from '~/types/user'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore( 'auth',
  {
    state: () => ({
      user: null as user | null,
      loading: false,
      isLoggingOut: false,
    }),

    getters: {
      isAuthenticated: (state) => !!state.user,
    },

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
      },

      setLoading(value: boolean) {
        this.loading = value
      },

      setLoggingOut(value: boolean) {
        this.isLoggingOut = value
      },

      $reset() {
        this.user = null
        this.loading = false
        this.isLoggingOut = false
      }
    },
    persist: true,
  })

