import type { Role, RoleCreateInput, RoleUpdateInput } from '#shared/types/role'
import type { ApiResponse } from '#shared/types/api-response'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class RoleService {
  private baseURL = '/api/roles'

  async getAll(): Promise<ApiResponse<Role[]>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<Role[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ALL_ROLES',
        endpoint
      })
    }
  }

  async findById(id: string): Promise<ApiResponse<Role>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ROLE_BY_ID',
        endpoint,
        roleId: id
      })
    }
  }

  async findByOrganization(organizationId: string): Promise<ApiResponse<Role[]>> {
    const endpoint = `${this.baseURL}/organization/${organizationId}`

    try {
      const response = await $fetch<ApiResponse<Role[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ROLES_BY_ORGANIZATION',
        endpoint,
        organizationId
      })
    }
  }

  async create(data: RoleCreateInput): Promise<ApiResponse<Role>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint, {
        method: 'POST',
        body: data,
      })
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'CREATE_ROLE',
        endpoint,
        roleName: data.name
      })
    }
  }

  async update(id: string, data: RoleUpdateInput): Promise<ApiResponse<Role>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint, {
        method: 'PUT',
        body: data,
      })
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'UPDATE_ROLE',
        endpoint,
        roleId: id
      })
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<void>>(endpoint, {
        method: 'DELETE',
      })
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'DELETE_ROLE',
        endpoint,
        roleId: id
      })
    }
  }
}

export const roleService = new RoleService()
