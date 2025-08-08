import type { ApiResponse } from '#shared/types/api-response'
import { sanitizeData } from '#shared/utils'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

type VerifyTokenResponse = { user: user }
type CheckAccessResponse = { hasAccess: boolean }
type LoginResponse = { user: user; message?: string }
type LogoutResponse = { message: string }

class AuthService {
  private baseURL = '/api/auth'

  /**
   * Verifica se o token JWT é válido e retorna dados do usuário
   */
  async verifyToken(): Promise<VerifyTokenResponse> {
    const endpoint = `${this.baseURL}/verify-token`

    try {
      const response = await $fetch<ApiResponse<VerifyTokenResponse>>(endpoint, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.AUTHENTICATION,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.AUTHENTICATION, {
        operation: 'VERIFY_TOKEN',
        endpoint
      })
    }
  }

  /**
   * Realiza login do usuário com email e senha
   */
  async login(credentials: loginCredentials): Promise<LoginResponse> {
    const endpoint = `${this.baseURL}/login`

    // Validação básica no cliente
    if (!credentials.email || !credentials.password) {
      throw enhanceError(
        new Error('E-mail e senha são obrigatórios'),
        ErrorContext.VALIDATION,
        {
          operation: 'LOGIN_VALIDATION',
          missingFields: !credentials.email ? ['email'] : ['password']
        }
      )
    }

    try {
      const response = await $fetch<ApiResponse<LoginResponse>>(endpoint, {
        method: 'POST',
        body: sanitizeData(credentials),
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.AUTHENTICATION,
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

      throw enhanceError(error, ErrorContext.AUTHENTICATION, {
        operation: 'LOGIN',
        endpoint,
        email: credentials.email // Para debugging (sem senha)
      })
    }
  }

  /**
   * Verifica se o usuário tem acesso ao sistema
   */
  async checkAccess(): Promise<CheckAccessResponse> {
    const endpoint = `${this.baseURL}/check-access`

    try {
      const response = await $fetch<ApiResponse<CheckAccessResponse>>(endpoint, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.AUTHORIZATION,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.AUTHORIZATION, {
        operation: 'CHECK_ACCESS',
        endpoint
      })
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<LogoutResponse> {
    const endpoint = `${this.baseURL}/logout`

    try {
      const response = await $fetch<ApiResponse<LogoutResponse>>(endpoint, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.AUTHENTICATION,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.AUTHENTICATION, {
        operation: 'LOGOUT',
        endpoint
      })
    }
  }
}

export const authService = new AuthService()
