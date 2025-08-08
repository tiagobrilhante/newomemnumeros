import type { ApiResponse } from '#shared/types/api-response'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class MilitaryOrganizationService {
  private baseURL = '/api/military-organizations'

  async findAll(): Promise<militaryOrganization[]> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<militaryOrganization[]>>(endpoint, {
        params: {
          include: {
            parentOrganization: true,
            sections: true
          },
        },
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
        operation: 'GET_ALL_MILITARY_ORGANIZATIONS',
        endpoint
      })
    }
  }

  async findById(id: string): Promise<militaryOrganization | null> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<militaryOrganization | null>>(endpoint)

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
        operation: 'GET_MILITARY_ORGANIZATION_BY_ID',
        endpoint,
        militaryOrganizationId: id
      })
    }
  }

  async create(data: militaryOrganization): Promise<militaryOrganization> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<militaryOrganization>>(endpoint, {
        method: 'POST',
        body: data,
        params: {
          include: {
            parentOrganization: true,
            subOrganizations: true,
            sections: true
          },
        },
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
        operation: 'CREATE_MILITARY_ORGANIZATION',
        endpoint,
        organizationName: data.name
      })
    }
  }

  async update(data: militaryOrganization): Promise<militaryOrganization> {
    const endpoint = `${this.baseURL}/${data.id}`

    try {
      const response = await $fetch<ApiResponse<militaryOrganization>>(endpoint, {
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
        operation: 'UPDATE_MILITARY_ORGANIZATION',
        endpoint,
        militaryOrganizationId: data.id
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

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'DELETE_MILITARY_ORGANIZATION',
        endpoint,
        militaryOrganizationId: id
      })
    }
  }

  async deleteLogo(id: string): Promise<militaryOrganization> {
    const endpoint = `${this.baseURL}/delete-logo/${id}`

    try {
      const response = await $fetch<ApiResponse<militaryOrganization>>(endpoint, {
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

      return response.data
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'DELETE_MILITARY_ORGANIZATION_LOGO',
        endpoint,
        militaryOrganizationId: id
      })
    }
  }
}

export const militaryOrganizationService = new MilitaryOrganizationService()
