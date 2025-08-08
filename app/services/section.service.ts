import type { ApiResponse } from '#shared/types/api-response'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class SectionService {
  private baseURL = '/api/sections'

  async findAll(): Promise<ApiResponse<section[]>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<section[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ALL_SECTIONS',
        endpoint
      })
    }
  }

  async findAllByMilitaryOrganizationId(id: string): Promise<ApiResponse<section[]>> {
    const endpoint = `${this.baseURL}/by-om-id/${id}`

    try {
      const response = await $fetch<ApiResponse<section[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_SECTIONS_BY_OM',
        endpoint,
        militaryOrganizationId: id
      })
    }
  }

  async findById(id: string): Promise<ApiResponse<section | null>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<section | null>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_SECTION_BY_ID',
        endpoint,
        sectionId: id
      })
    }
  }

  async create(data: section): Promise<ApiResponse<section>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<section>>(endpoint, {
        method: 'POST',
        body: data,
      })

      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'CREATE_SECTION',
        endpoint,
        sectionName: data.name
      })
    }
  }

  async update(data: section): Promise<ApiResponse<section>> {
    const endpoint = `${this.baseURL}/${data.id}`

    try {
      const response = await $fetch<ApiResponse<section>>(endpoint, {
        method: 'PUT',
        body: data,
      })

      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'UPDATE_SECTION',
        endpoint,
        sectionId: data.id
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
        operation: 'DELETE_SECTION',
        endpoint,
        sectionId: id
      })
    }
  }
}

export const sectionService = new SectionService()
