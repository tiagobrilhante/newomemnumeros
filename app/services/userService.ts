import type { userWithoutPassword } from '~/types/user'

class UserService {
  private baseURL = '/api/users'

  async getAllUsers(): Promise<userWithoutPassword[]> {
    try {
      return await $fetch<userWithoutPassword[]>(this.baseURL)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  async findUserById(id: string): Promise<userWithoutPassword | null> {
    try {
      return await $fetch<userWithoutPassword>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error)
      throw error
    }
  }

  async findUserByServiceName(serviceName: string): Promise<userWithoutPassword[]> {
    try {
      return await $fetch<userWithoutPassword[]>(`${this.baseURL}/get-user-by-servicename`, {
        method: 'POST',
        body: { serviceName },
      })
    } catch (error) {
      console.error(`Erro ao buscar usuário ${serviceName}:`, error)
      throw error
    }
  }

  async findUserByServiceNameAll(serviceName: string): Promise<userWithoutPassword[]> {
    try {
      return await $fetch<userWithoutPassword[]>(
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

  async deleteUser(id: string): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/${id}`, {
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
