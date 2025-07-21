import { registerService } from '~/services/register.service'
import type { registerData } from '~/types/auth'

export const useRegister = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: registerData) => {
    loading.value = true
    error.value = null

    try {
      const response = await registerService.register(data)
      return { 
        success: true, 
        message: response.message,
        statusCode: response.statusCode 
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro inesperado no registro'
      error.value = errorMessage
      return {
        success: false,
        message: errorMessage,
        statusCode: err?.statusCode || 500,
      }
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
