import { defineStore } from 'pinia'

// noinspection JSUnusedGlobalSymbols
export const useNavigationStore = defineStore('navigation',
  {
    state: () => ({
      menuCollapsed: false,
      atualPath: '/',
      selectedLanguage: 'pt-BR', // Valor padrão, mas será sobrescrito pela persistência
      loading: false,
    }),

    getters: {
      isMenuCollapsed: (state) => !!state.menuCollapsed,
    },

    actions: {
      setCollapsedMenu(menuState: boolean) {
        this.menuCollapsed = menuState
      },

      toggleCollapsedMenu() {
        this.menuCollapsed = !this.menuCollapsed
      },

      setCurrentPath(path: string) {
        this.atualPath = path
      },

      setLoading(value: boolean) {
        this.loading = value
      },

      setSelectedLanguage(language: string) {
        this.selectedLanguage = language
      },
    },
    persist: true,
  })

