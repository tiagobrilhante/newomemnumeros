import type { RegisterResponse } from '~/services/register.service'
import { registerService } from '~/services/register.service'

// noinspection JSUnusedGlobalSymbols
export const useRegister = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: registerData): Promise<RegisterResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await registerService.register(data)

      if (!response.success) {
        error.value = response.message
      }

      return response
    } catch (_err) {
      const fallbackResponse: RegisterResponse = {
        success: false,
        message: $t('serverCommunication'),
        statusCode: 500,
      }
      error.value = fallbackResponse.message
      return fallbackResponse
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    register,
  }
}
