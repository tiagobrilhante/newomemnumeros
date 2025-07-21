import type { registerData } from '~/types/auth'
import { sanitizeData } from '~/utils/sanitize-data'
import type { H3Error } from 'h3'

class RegisterService {
  private baseURL = '/api/auth'

  async register(data: registerData): Promise<any> {
    const endpoint = `${this.baseURL}/register`
    try {
      return await $fetch<any>(endpoint, {
        method: 'POST',
        body: sanitizeData(data),
      })
    } catch (error: any) {
      throw {
        message: error?.data?.message || error?.message || 'Erro no registro',
        statusCode: error?.statusCode || error?.status || 500,
        data: error?.data || null
      }
    }
  }
}

export const registerService = new RegisterService()
