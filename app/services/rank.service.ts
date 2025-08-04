import type { rank } from '~/types/rank'
import type { ApiResponse } from '#shared/types/api-response'

class RankService {
  private baseURL = '/api/ranks'

  async findAll(): Promise<ApiResponse<rank[]>> {
    return await $fetch<ApiResponse<rank[]>>(this.baseURL)
  }

  async findById(id: string): Promise<ApiResponse<rank | null>> {
    return await $fetch<ApiResponse<rank>>(`${this.baseURL}/${id}`)
  }

  async findByHierarchy(hierarchy: number): Promise<ApiResponse<rank[]>> {
    return await $fetch<ApiResponse<rank[]>>(`${this.baseURL}/hierarchy/${hierarchy}`)
  }

  async create(data: rank): Promise<ApiResponse<rank>> {
    return await $fetch<ApiResponse<rank>>(this.baseURL, {
      method: 'POST',
      body: data,
    })
  }

  async update(data: rank): Promise<ApiResponse<rank>> {
    return await $fetch<ApiResponse<rank>>(`${this.baseURL}/${data.id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return await $fetch<ApiResponse<{ message: string }>>(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    })
  }

  async findAllOrdered(): Promise<rank[]> {
    const response = await this.findAll()
    return response.data.sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSuperior(hierarchy: number): Promise<rank[]> {
    const response = await this.findAll()
    return response.data
      .filter((rank) => rank.hierarchy < hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSubordinate(hierarchy: number): Promise<rank[]> {
    const response = await this.findAll()
    return response.data
      .filter((rank) => rank.hierarchy > hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }
}

export const rankService = new RankService()
