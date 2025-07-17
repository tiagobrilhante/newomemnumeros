
import type { authResponse, loginCredentials, registerData } from '~/types/auth'
import type { user } from '~/types/core/user'

// TODO preciso arrumar a a situação dos erros (padronização)
class ApiError extends Error {
  status: number
  endpoint: string
  details?: string

  constructor(message: string, status: number, endpoint: string, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
    this.details = details
  }
}

type VerifyTokenResponse = { user: user }
type RegisterResponse = { success: boolean }
type CheckAccessResponse = { hasAccess: boolean }

class AuthService {
  private baseURL = '/api/auth'

  async verifyToken(): Promise<VerifyTokenResponse> {
    const endpoint = `${this.baseURL}/verify-token`
    try {
      return await $fetch<VerifyTokenResponse>(endpoint, {
        method: 'GET',
        credentials: 'include'
      })
    } catch (error) {
      if (this.isApiError(error) && error.status === 401) {
        if (error.message.includes('jwt expired')) {
          throw new Error('Token expirado. Por favor, faça login novamente.')
        }
        throw this.handleError(error)
      }

      console.error(`Erro ao verificar token no endpoint: ${endpoint}`, error)

      if (this.isApiError(error)) {
        throw this.handleError(error)
      }

      throw new Error(
        'Ocorreu um erro inesperado ao verificar o token. Por favor, tente novamente mais tarde.'
      )
    }
  }

  async login(credentials: loginCredentials): Promise<authResponse> {
    const endpoint = `${this.baseURL}/login`

    if (!credentials.email || !credentials.password) {
      throw createError({
        message: 'E-mail e senha são obrigatórios',
        statusCode: 400,
      })
    }

    try {
      return await $fetch<authResponse>(endpoint, {
        method: 'POST',
        body: this.sanitizeData(credentials),
      })
    } catch (error) {
      console.error(`Erro ao fazer login no endpoint ${endpoint}:`, error)

      if (this.isApiError(error)) {
        const { status } = error

        switch (status) {
          case 400:
            throw new Error('Erro de validação: Por favor, verifique suas credenciais.')
          case 401:
            throw new Error('Credenciais inválidas. Por favor, tente novamente.')
          case 429:
            throw new Error('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.')
          default:
            throw this.handleError(error)
        }
      }

      throw new Error(
        'Ocorreu um erro inesperado ao tentar fazer login. Por favor, tente novamente mais tarde.'
      )
    }
  }

  async register(data: registerData): Promise<RegisterResponse> {
    const endpoint = `${this.baseURL}/register`
    try {
      return await $fetch<RegisterResponse>(endpoint, {
        method: 'POST',
        body: this.sanitizeData(data),
      })
    } catch (error) {
      console.error(`Erro ao registrar usuário no endpoint ${endpoint}:`, error)

      if (this.isApiError(error)) {
        const { status } = error

        switch (status) {
          case 400:
            throw new Error(
              'Dados inválidos fornecidos. Verifique as informações do formulário e tente novamente.'
            )
          case 409:
            throw new Error('Usuário já registrado. Tente fazer login ou usar outro e-mail.')
          case 422:
            throw new Error(
              'Não foi possível processar os dados fornecidos. Verifique os campos obrigatórios.'
            )
          default:
            throw this.handleError(error)
        }
      }

      throw new Error(
        'Ocorreu um erro inesperado ao tentar registrar o usuário. Por favor, tente novamente mais tarde.'
      )
    }
  }

  async checkAccess(): Promise<CheckAccessResponse> {
    const endpoint = `${this.baseURL}/check-access`

    try {
      return await $fetch<CheckAccessResponse>(endpoint, {
        method: 'GET',
        credentials: 'include'
      })
    } catch (error) {
      const status = this.getErrorStatus(error)
      const details = this.getErrorMessage(error)

      if (status !== 401) {
        console.error(`[${status}] Erro ao acessar "${endpoint}"`)
        if (details) console.error('Detalhes:', details)
      }

      const errorsMap: Record<number, string> = {
        401: 'Acesso negado. Você precisa fazer login novamente.',
        403: 'Permissão insuficiente para acessar este recurso.',
        404: 'Endpoint não encontrado. Por favor, verifique a URL utilizada.',
        500: 'Erro interno no servidor. Por favor, tente novamente mais tarde.',
      }

      if (errorsMap[status]) {
        throw new ApiError(errorsMap[status], status, endpoint, details)
      }

      throw new ApiError(
        'Ocorreu um erro inesperado ao verificar o acesso. Por favor, tente novamente mais tarde.',
        status,
        endpoint,
        details
      )
    }
  }

  private isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'status' in error && 'message' in error
  }

  private sanitizeData<T extends object>(data: T): T {
    return Object.entries(data).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: typeof value === 'string' ? value.trim() : value,
      }),
      {} as T
    )
  }

  private handleError(error: ApiError): Error {
    const statusMessagesMap: Record<number, string> = {
      400: 'Requisição inválida. Por favor, verifique os dados enviados.',
      401: 'Não autorizado. Por favor, faça login novamente.',
      403: 'Sem permissão para acessar este recurso.',
      404: 'Recurso não encontrado. Verifique se o endereço está correto.',
      408: 'Tempo de requisição esgotado. Por favor, tente novamente.',
      429: 'Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.',
      500: 'Erro interno no servidor. Tente novamente mais tarde.',
      502: 'Gateway inválido. Ocorreu um problema temporário com o servidor.',
      503: 'Serviço indisponível. O servidor está momentaneamente sobrecarregado ou em manutenção.',
      504: 'Tempo de resposta excedido. O servidor demorou muito para responder.',
    }

    if (statusMessagesMap[error.status]) {
      return new Error(statusMessagesMap[error.status])
    }

    if (error.message) {
      return new Error(`Erro inesperado: ${error.message}`)
    }

    return new Error('Ocorreu um erro desconhecido. Por favor, tente novamente.')
  }

  private getErrorStatus(error: unknown): number {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return (error as ApiError).status || 500
    }
    return 500
  }

  private getErrorMessage(error: unknown): string | undefined {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as Error).message
    }
    return undefined
  }

  async logout(): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }
}

export const authService = new AuthService()
