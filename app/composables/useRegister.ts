import { registerService } from '~/services/register.service'
import type { registerData } from '#shared/types/register'
import type { ApiResponse, ErrorResponse } from '#shared/types/api-response'
import { ErrorCode } from '#shared/types/api-response'

// noinspection JSUnusedGlobalSymbols
export const useRegister = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: registerData): Promise<ApiResponse<any>> => {
    loading.value = true
    error.value = null

    try {
      const response = await registerService.register(data)

      if (!response.success) {
        error.value = response.error.message
      }

      return response
    } catch (_err) {
      const fallbackResponse: ErrorResponse = {
        success: false,
        error: {
          message: $t('serverCommunication'),
          code: ErrorCode.UNKNOWN_ERROR,
          statusCode: 500,
        },
        data: null,
      }
      error.value = fallbackResponse.error.message
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
