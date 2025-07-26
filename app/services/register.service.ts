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

    const message = error?.data?.message || error?.message || $t('errors.serverCommunicationError')

    return {
      success: false,
      message,
      statusCode,
      data: error?.data || null
    }
  }
}

export const registerService = new RegisterService()
