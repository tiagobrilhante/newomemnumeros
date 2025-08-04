import type { ApiResponse } from '#shared/types/api-response'
import { sanitizeData } from '#shared/utils'

class RegisterService {
  private baseURL = '/api/auth'

  async register(data: registerData): Promise<ApiResponse<any>> {
    const endpoint = `${this.baseURL}/register`

    try {
      return await $fetch<ApiResponse<any>>(endpoint, {
        method: 'POST',
        body: sanitizeData(data),
      })
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }
}

export const registerService = new RegisterService()
