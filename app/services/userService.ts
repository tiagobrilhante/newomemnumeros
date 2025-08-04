import type { userWithoutPassword } from '~/types/user'
import type { ApiResponse } from '#shared/types/api-response'

class UserService {
  private baseURL = '/api/users'

  async getAllUsers(): Promise<ApiResponse<userWithoutPassword[]>> {
    try {
      return await $fetch<ApiResponse<userWithoutPassword[]>>(this.baseURL)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  async findUserById(id: string): Promise<ApiResponse<userWithoutPassword | null>> {
    try {
      return await $fetch<ApiResponse<userWithoutPassword>>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error)
      throw error
    }
  }

  async findUserByServiceName(serviceName: string): Promise<ApiResponse<userWithoutPassword[]>> {
    try {
      return await $fetch<ApiResponse<userWithoutPassword[]>>(`${this.baseURL}/get-user-by-servicename`, {
        method: 'POST',
        body: { serviceName },
      })
    } catch (error) {
      console.error(`Erro ao buscar usuário ${serviceName}:`, error)
      throw error
    }
  }

  async findUserByServiceNameAll(serviceName: string): Promise<ApiResponse<userWithoutPassword[]>> {
    try {
      return await $fetch<ApiResponse<userWithoutPassword[]>>(
        `${this.baseURL}/get-users-by-servicename-all-om`,
        {
          method: 'POST',
          body: { serviceName },
        }
      )
    } catch (error) {
      console.error(`Erro ao buscar usuário ${serviceName}:`, error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await $fetch<ApiResponse<{ message: string }>>(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error)
      throw error
    }
  }
}
// Instância única do serviço
export const userService = new UserService()
