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
      // Para erros do Nuxt/H3, error.data contém a resposta da API
      const errorMessage = error?.data?.message || error?.message || 'Erro no registro'
      const statusCode = error?.statusCode || error?.status || 500
      
      throw {
        message: errorMessage,
        statusCode,
        data: error?.data || null
      }
    }
  }
}

export const registerService = new RegisterService()
