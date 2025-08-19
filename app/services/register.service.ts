import type { ApiResponse } from '#shared/types/api-response'
import type { registerData, RegisterResponse } from '#shared/types/register'
import { sanitizeData } from '#shared/utils'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class RegisterService {
  private baseURL = '/api/auth'

  async register(data: registerData): Promise<ApiResponse<RegisterResponse>> {
    const endpoint = `${this.baseURL}/register`

    try {
      const response = await $fetch<ApiResponse<RegisterResponse>>(endpoint, {
        method: 'POST',
        body: sanitizeData(data),
      })

      return response
    } catch (error) {
      // Se já é um EnhancedError, re-lança
      if (error && typeof error === 'object' && 'context' in error) {
        throw error
      }

      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'REGISTER_USER',
        endpoint,
        email: data.email
      })
    }
  }
}

export const registerService = new RegisterService()
