type VerifyTokenResponse = { user: user }
type CheckAccessResponse = { hasAccess: boolean }

class AuthService {
  private baseURL = '/api/auth'

  async verifyToken(): Promise<any> {
    const endpoint = `${this.baseURL}/verify-token`
    try {
      return await $fetch<VerifyTokenResponse>(endpoint, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (error) {
      console.error(`Erro ao verificar token no endpoint: ${endpoint}`, error)
    }
  }

  async login(credentials: loginCredentials): Promise<any> {
    const endpoint = `${this.baseURL}/login`

    if (!credentials.email || !credentials.password) {
      throw createError({
        message: 'E-mail e senha são obrigatórios',
        statusCode: 400,
      })
    }

    try {
      return await $fetch<any>(endpoint, {
        method: 'POST',
        body: sanitizeData(credentials),
      })
    } catch (error) {
      console.error(`Erro ao fazer login no endpoint ${endpoint}:`, error)
    }
  }

  async checkAccess(): Promise<any> {
    const endpoint = `${this.baseURL}/check-access`

    try {
      return await $fetch<CheckAccessResponse>(endpoint, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (error) {
      console.error(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }
}

export const authService = new AuthService()
