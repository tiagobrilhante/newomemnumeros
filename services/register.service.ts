import type { registerData } from '~/types/auth'
import { sanitizeData } from '~/utils/sanitize-data'

export interface RegisterResponse {
  success: boolean
  message: string
  statusCode: number
  data?: any
}

class RegisterService {
  private baseURL = '/api/auth'

  async register(data: registerData): Promise<RegisterResponse> {
    const endpoint = `${this.baseURL}/register`

    try {
      const response = await $fetch<any>(endpoint, {
        method: 'POST',
        body: sanitizeData(data),
      })

      return {
        success: true,
        message: response.message || $t('success.userRegistered') ,
        statusCode: response.statusCode || 201,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  private handleError(error: any): RegisterResponse {
    const statusCode = error?.statusCode || error?.status || 500
    let message = $t('errors.internalRegistrationError')

    if (error?.data?.message) {
      message = error.data.message
    } else if (error?.message) {
      message = error.message
    } else {
      if (statusCode >= 500) {
        message = $t('errors.internalServerError')
      } else if (statusCode === 400) {
        message = $t('errors.invalidDataProvided')
      }
    }

    return {
      success: false,
      message,
      statusCode,
      data: error?.data || null
    }
  }
}

export const registerService = new RegisterService()
