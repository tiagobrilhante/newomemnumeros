import type { rank } from '#shared/types/rank'
import type { ApiResponse } from '#shared/types/api-response'
import { enhanceError, ErrorContext } from '~/utils/clientErrorHandler'

class RankService {
  private baseURL = '/api/ranks'

  async findAll(): Promise<ApiResponse<rank[]>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<rank[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_ALL_RANKS',
        endpoint
      })
    }
  }

  async findById(id: string): Promise<ApiResponse<rank | null>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<rank | null>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_RANK_BY_ID',
        endpoint,
        rankId: id
      })
    }
  }

  async findByHierarchy(hierarchy: number): Promise<ApiResponse<rank[]>> {
    const endpoint = `${this.baseURL}/hierarchy/${hierarchy}`

    try {
      const response = await $fetch<ApiResponse<rank[]>>(endpoint)
      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'GET_RANKS_BY_HIERARCHY',
        endpoint,
        hierarchy
      })
    }
  }

  async create(data: rank): Promise<ApiResponse<rank>> {
    const endpoint = this.baseURL

    try {
      const response = await $fetch<ApiResponse<rank>>(endpoint, {
        method: 'POST',
        body: data,
      })

      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'CREATE_RANK',
        endpoint,
        rankName: data.name
      })
    }
  }

  async update(data: rank): Promise<ApiResponse<rank>> {
    const endpoint = `${this.baseURL}/${data.id}`

    try {
      const response = await $fetch<ApiResponse<rank>>(endpoint, {
        method: 'PUT',
        body: data,
      })

      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'UPDATE_RANK',
        endpoint,
        rankId: data.id
      })
    }
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    const endpoint = `${this.baseURL}/${id}`

    try {
      const response = await $fetch<ApiResponse<{ message: string }>>(endpoint, {
        method: 'DELETE',
      })

      return response
    } catch (error) {
      throw enhanceError(error, ErrorContext.BUSINESS_LOGIC, {
        operation: 'DELETE_RANK',
        endpoint,
        rankId: id
      })
    }
  }

  async findAllOrdered(): Promise<rank[]> {
    const response = await this.findAll()
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch ranks')
    }
    return response.data.sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSuperior(hierarchy: number): Promise<rank[]> {
    const response = await this.findAll()
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch ranks')
    }
    return response.data
      .filter((rank) => rank.hierarchy < hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSubordinate(hierarchy: number): Promise<rank[]> {
    const response = await this.findAll()
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch ranks')
    }
    return response.data
      .filter((rank) => rank.hierarchy > hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }
}

export const rankService = new RankService()
