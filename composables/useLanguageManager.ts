export const useLanguageManager = () => {
  const { locale, setLocale } = useI18n()
  const navigationStore = useNavigationStore()

  const initializeLanguage = () => {
    if (navigationStore.selectedLanguage) {
      setLocale(navigationStore.selectedLanguage)
    }
  }

  const changeLanguage = (languageCode: string) => {
    navigationStore.setSelectedLanguage(languageCode)
    setLocale(languageCode)
  }

  // Flag para evitar loops durante inicialização
  const isInitializing = ref(false)

  // Observar mudanças no i18n e sincronizar com a store (apenas se não estiver inicializando)
  watch(locale, (newLocale, oldLocale) => {
    // IMPORTANTE: Só aceitar mudanças se não estivermos controlando
    if (!isInitializing.value && newLocale !== navigationStore.selectedLanguage) {
      // Reverter para o valor da store em vez de aceitar a mudança externa
      if (navigationStore.selectedLanguage) {
        isInitializing.value = true
        setLocale(navigationStore.selectedLanguage)
        nextTick(() => {
          isInitializing.value = false
        })
      }
    }
  })

  // Observar mudanças na store e sincronizar com i18n (dar prioridade à store)
  watch(
    () => navigationStore.selectedLanguage,
    (newLanguage, oldLanguage) => {
      if (newLanguage && newLanguage !== locale.value) {
        isInitializing.value = true
        setLocale(newLanguage)
        nextTick(() => {
          isInitializing.value = false
        })
      }
    },
    { immediate: true }
  )

  return {
    selectedLanguage: computed(() => navigationStore.selectedLanguage),
    initializeLanguage,
    changeLanguage,
  }
}