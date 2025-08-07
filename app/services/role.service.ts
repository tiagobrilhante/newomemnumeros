import type { Role, RoleCreateInput, RoleUpdateInput } from '#shared/types/role'
import type { ApiResponse } from '#shared/types/api-response'

class RoleService {
  private baseURL = '/api/roles'

  async getAll(): Promise<ApiResponse<Role[]>> {
    try {
      return await $fetch<ApiResponse<Role[]>>(`${this.baseURL}`)
    } catch (error) {
      console.error('Erro ao buscar todos os roles:', error)
      throw error
    }
  }

  async findById(id: string): Promise<ApiResponse<Role>> {
    try {
      return await $fetch<ApiResponse<Role>>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar role ${id}:`, error)
      throw error
    }
  }

  async findByOrganization(organizationId: string): Promise<ApiResponse<Role[]>> {
    try {
      return await $fetch<ApiResponse<Role[]>>(`${this.baseURL}/organization/${organizationId}`)
    } catch (error) {
      console.error(`Erro ao buscar roles da organização ${organizationId}:`, error)
      throw error
    }
  }

  async create(data: RoleCreateInput): Promise<ApiResponse<Role>> {
    try {
      return await $fetch<ApiResponse<Role>>(this.baseURL, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      console.error('Erro ao criar role:', error)
      throw error
    }
  }

  async update(id: string, data: RoleUpdateInput): Promise<ApiResponse<Role>> {
    try {
      return await $fetch<ApiResponse<Role>>(`${this.baseURL}/${id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar role ${id}:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      return await $fetch<ApiResponse<void>>(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar role ${id}:`, error)
      throw error
    }
  }
}

export const roleService = new RoleService()
