import { useNavigationStore } from '~/stores/navigation.store'

// noinspection JSUnusedGlobalSymbols
export const useNavigation = () => {
  const store = useNavigationStore()

  // Computed properties (accessors)
  const isMenuCollapsed = computed(() => store.isMenuCollapsed)
  const currentPath = computed(() => store.atualPath)
  const selectedLanguage = computed(() => store.selectedLanguage)
  const loading = computed(() => store.loading)

  // Actions
  const setCollapsedMenu = (menuState: boolean) => {
    store.setCollapsedMenu(menuState)
  }

  const toggleCollapsedMenu = () => {
    store.toggleCollapsedMenu()
  }

  const setCurrentPath = (path: string) => {
    store.setCurrentPath(path)
  }

  const setLoading = (value: boolean) => {
    store.setLoading(value)
  }

  const setSelectedLanguage = (language: string) => {
    store.setSelectedLanguage(language)
  }

  return {
    // Computed state
    isMenuCollapsed,
    currentPath,
    selectedLanguage,
    loading,

    // Actions
    setCollapsedMenu,
    toggleCollapsedMenu,
    setCurrentPath,
    setLoading,
    setSelectedLanguage,
  }
}