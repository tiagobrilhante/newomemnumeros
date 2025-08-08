import type { Role, RoleCreateInput, RoleUpdateInput } from '#shared/types/role'
import type { ApiResponse } from '#shared/types/api-response'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class RoleService {
  private baseURL = '/api/roles'

  async getAll(): Promise<Role[]> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<Role[]>>(endpoint)

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ALL_ROLES',
        endpoint
      })
    }
  }

  async findById(id: string): Promise<Role> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint)

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ROLE_BY_ID',
        endpoint,
        roleId: id
      })
    }
  }

  async findByOrganization(organizationId: string): Promise<Role[]> {
    const endpoint = `${this.baseURL}/organization/${organizationId}`

    try {
      const response = await $fetch<ApiResponse<Role[]>>(endpoint)

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ROLES_BY_ORGANIZATION',
        endpoint,
        organizationId
      })
    }
  }

  async create(data: RoleCreateInput): Promise<Role> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint, {
        method: 'POST',
        body: data,
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'CREATE_ROLE',
        endpoint,
        roleName: data.name
      })
    }
  }

  async update(id: string, data: RoleUpdateInput): Promise<Role> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<Role>>(endpoint, {
        method: 'PUT',
        body: data,
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'UPDATE_ROLE',
        endpoint,
        roleId: id
      })
    }
  }

  async delete(id: string): Promise<void> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<void>>(endpoint, {
        method: 'DELETE',
      })

      if (!response.success) {
        throw enhanceError(
          new Error(response.error.message),
          ErrorContext.BUSINESS_LOGIC,
          {
            endpoint,
            errorCode: response.error.code,
            statusCode: response.error.statusCode
          }
        )
      }

      // Para void, não retornamos response.data
      return
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
