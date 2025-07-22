// Base interfaces
interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

interface BaseDTO {
  id: number
}

interface RankAttributes {
  name: string
  acronym: string
  hierarchy: number
}

interface Rank extends BaseEntity, RankAttributes {
}

type CreateRankDTO = RankAttributes

interface UpdateRankDTO extends Partial<RankAttributes>, BaseDTO {
}

class RankService {
  private baseURL = '/api/ranks'


  async findAll(): Promise<Rank[]> {
    return await $fetch<Rank[]>(this.baseURL)
  }

  async findById(id: number): Promise<Rank | null> {
    return await $fetch<Rank>(`${this.baseURL}/${id}`)
  }

  async findByHierarchy(hierarchy: number): Promise<Rank[]> {
    return await $fetch<Rank[]>(`${this.baseURL}/hierarchy/${hierarchy}`)
  }

  async create(data: CreateRankDTO): Promise<Rank> {
    return await $fetch<Rank>(this.baseURL, {
      method: 'POST',
      body: data,
    })
  }

  async update(data: UpdateRankDTO): Promise<Rank> {
    return await $fetch<Rank>(`${this.baseURL}/${data.id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    })
  }

  async findAllOrdered(): Promise<Rank[]> {
    const ranks = await this.findAll()
    return ranks.sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSuperior(hierarchy: number): Promise<Rank[]> {
    const ranks = await this.findAll()
    return ranks
      .filter((rank) => rank.hierarchy < hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }

  async findSubordinate(hierarchy: number): Promise<Rank[]> {
    const ranks = await this.findAll()
    return ranks
      .filter((rank) => rank.hierarchy > hierarchy)
      .sort((a, b) => a.hierarchy - b.hierarchy)
  }
}

export const rankService = new RankService()
