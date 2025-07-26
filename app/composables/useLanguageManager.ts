import { getValidLocaleOrDefault, isValidLocale } from '#shared/config/i18n'
import type { ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { createAppError } from '~/utils/clientErrorHandler'

// noinspection JSUnusedGlobalSymbols
export const useLanguageManager = () => {
  const { locale, setLocale } = useI18n()
  const navigationStore = useNavigationStore()
  const isChanging = ref(false)

  const initializeLanguage = () => {
    const storedLanguage = navigationStore.selectedLanguage
    if (storedLanguage && storedLanguage !== locale.value) {
      void changeLanguage(storedLanguage)
    }
  }

  const changeLanguage = async (languageCode: string) => {
    if (isChanging.value || languageCode === locale.value) {
      return
    }

    if (!isValidLocale(languageCode)) {
      // Usa o handler para idioma inválido
      const appError = createAppError('errors.unsupportedLanguage', {
        statusCode: 400,
        statusMessageKey: 'errors.unsupportedLanguage',
        fallbackStatusMessage: 'Invalid Language',
        fallbackMessage: `Idioma não suportado: ${languageCode}`,
      } satisfies ErrorHandlerOptions)

      console.error('Invalid language:', appError.message)
      return
    }

    isChanging.value = true

    try {
      navigationStore.setSelectedLanguage(languageCode)
      await setLocale(languageCode)
      await nextTick()
    } catch (error) {
      createAppError('errors.languageChangeError', {
        statusCode: 500,
        statusMessageKey: 'errors.languageChangeError',
        fallbackStatusMessage: 'Language Change Error',
        fallbackMessage: 'Erro ao alterar idioma',
      } satisfies ErrorHandlerOptions)

      const validLocale = getValidLocaleOrDefault(locale.value)
      navigationStore.setSelectedLanguage(validLocale)

    } finally {
      isChanging.value = false
    }
  }

  watch(
    () => navigationStore.selectedLanguage,
    (newLanguage) => {
      if (newLanguage && newLanguage !== locale.value && !isChanging.value) {
        void changeLanguage(newLanguage)
      }
    },
    { immediate: true },
  )

  return {
    selectedLanguage: computed(() => navigationStore.selectedLanguage),
    currentLocale: computed(() => locale.value),
    isChangingLanguage: readonly(isChanging),
    initializeLanguage,
    changeLanguage,
  }
}
