import { defineStore } from 'pinia'

// noinspection JSUnusedGlobalSymbols
export const useAuthUserStore = defineStore( 'auth',
  {
    state: () => ({
      user: null as user | null,
      loading: false,
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
      }
    },
    persist: true,
  })

