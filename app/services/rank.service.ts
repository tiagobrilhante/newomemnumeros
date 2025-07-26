import type { rank } from '~/types/rank'

class RankService {
  private baseURL = '/api/ranks'


  async findAll(): Promise<rank[]> {
    const response = await $fetch<{ success: boolean, data: rank[], message: string, statusCode: number }>(this.baseURL)
    return response.data
  }

  async findById(id: string): Promise<rank | null> {
    return await $fetch<rank>(`${this.baseURL}/${id}`)
  }

  async findByHierarchy(hierarchy: number): Promise<rank[]> {
    return await $fetch<rank[]>(`${this.baseURL}/hierarchy/${hierarchy}`)
  }

  async create(data: rank): Promise<rank> {
    return await $fetch<rank>(this.baseURL, {
      method: 'POST',
      body: data,
    })
  }

  async update(data: rank): Promise<rank> {
    return await $fetch<rank>(`${this.baseURL}/${data.id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async delete(id: string): Promise<void> {
    await $fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    })
  }

  async findAllOrdered(): Promise<rank[]> {
    const ranks = await this.findAll()
    return ranks.sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSuperior(hierarchy: number): Promise<rank[]> {
    const ranks = await this.findAll()
    return ranks
      .filter((rank) => rank.hierarchy < hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSubordinate(hierarchy: number): Promise<rank[]> {
    const ranks = await this.findAll()
    return ranks
      .filter((rank) => rank.hierarchy > hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }
}

export const rankService = new RankService()
