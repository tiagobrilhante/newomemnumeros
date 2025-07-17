import { useAuthUserStore } from '~/stores/auth.store'
import type { NitroFetchOptions } from 'nitropack'

/**
 * Classe base para serviços que precisam de autenticação
 * Fornece métodos comuns e utilitários para realizar requisições autenticadas
 */
export class BaseService {
  /**
   * Recupera o cabeçalho de autenticação com o token JWT
   * @returns objeto com o cabeçalho Authorization ou objeto vazio se não houver token
   */
  protected getAuthHeader(): { Authorization?: string } {
    // Só executa no cliente
    if (import.meta.client) {
      const authStore = useAuthUserStore()
      if (authStore && authStore.token) {
        return {
          Authorization: `Bearer ${authStore.token}`,
        }
      }
    }
    return {}
  }

  /**
   * Atualiza o cookie de autenticação no cliente
   */
  protected updateAuthCookie(): void {
    if (import.meta.client) {
      const authStore = useAuthUserStore()
      if (authStore && authStore.token) {
        const cookieValue = JSON.stringify({
          token: authStore.token,
          user: authStore.user,
          isAuthenticated: true,
        })
        document.cookie = `auth=${encodeURIComponent(cookieValue)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }
    }
  }

  /**
   * Realiza uma requisição com autenticação
   * @param url URL para a requisição
   * @param options Opções adicionais para a requisição
   * @returns Promessa com o resultado da requisição
   */
  protected async $fetchWithAuth<T>(
    url: string,
    options: Partial<NitroFetchOptions<string>> = {}
  ): Promise<T> {
    const authHeader = this.getAuthHeader()

    // Mescla os headers de autenticação com os headers fornecidos
    const mergedOptions = {
      ...options,
      credentials: 'include' as const,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...authHeader,
      },
    }

    try {
      // Atualiza o cookie de autenticação
      this.updateAuthCookie()

      // Usa $fetch diretamente e faz type assertion para T
      const response = await $fetch(url, mergedOptions)
      return response as T
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error)
      throw error
    }
  }
}
