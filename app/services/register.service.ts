import type { ApiResponse } from '#shared/types/api-response'
import { sanitizeData } from '#shared/utils'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class RegisterService {
  private baseURL = '/api/auth'

  async register(data: registerData): Promise<any> {
    const endpoint = `${this.baseURL}/register`

    try {
      const response = await $fetch<ApiResponse<any>>(endpoint, {
        method: 'POST',
        body: sanitizeData(data),
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      // Se já é um EnhancedError, re-lança
      if (error && typeof error === 'object' && 'context' in error) {
        throw error
      }

      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'REGISTER_USER',
        endpoint,
        email: data.email // Para debugging (sem dados sensíveis)
      })
    }
  }
}

export const registerService = new RegisterService()
