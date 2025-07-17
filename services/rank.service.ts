// Base interfaces
interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

interface BaseDTO {
  id: number
}

// Rank specific interfaces
interface RankAttributes {
  name: string
  acronym: string
  hierarchy: number
}

interface Rank extends BaseEntity, RankAttributes {}

type CreateRankDTO = RankAttributes

interface UpdateRankDTO extends Partial<RankAttributes>, BaseDTO {}

class RankService {
  private baseURL = '/api/ranks'

  // Buscar todos os ranks
  async findAll(): Promise<Rank[]> {
    try {
      return await $fetch<Rank[]>(this.baseURL)
    } catch (error) {
      console.error('Erro ao buscar ranks:', error)
      throw error
    }
  }

  // Buscar rank por ID
  async findById(id: number): Promise<Rank | null> {
    try {
      return await $fetch<Rank>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar rank ${id}:`, error)
      throw error
    }
  }

  // Buscar ranks por hierarquia
  async findByHierarchy(hierarchy: number): Promise<Rank[]> {
    try {
      return await $fetch<Rank[]>(`${this.baseURL}/hierarchy/${hierarchy}`)
    } catch (error) {
      console.error(`Erro ao buscar ranks com hierarquia ${hierarchy}:`, error)
      throw error
    }
  }

  // Criar novo rank
  async create(data: CreateRankDTO): Promise<Rank> {
    try {
      return await $fetch<Rank>(this.baseURL, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      console.error('Erro ao criar rank:', error)
      throw error
    }
  }

  // Atualizar rank
  async update(data: UpdateRankDTO): Promise<Rank> {
    try {
      return await $fetch<Rank>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar rank ${data.id}:`, error)
      throw error
    }
  }

  // Deletar rank
  async delete(id: number): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar rank ${id}:`, error)
      throw error
    }
  }

  // Buscar ranks ordenados por hierarquia
  async findAllOrdered(): Promise<Rank[]> {
    try {
      const ranks = await this.findAll()
      return ranks.sort((a, b) => a.hierarchy - b.hierarchy)
    } catch (error) {
      console.error('Erro ao buscar ranks ordenados:', error)
      throw error
    }
  }

  // Buscar ranks superiores a uma determinada hierarquia
  async findSuperior(hierarchy: number): Promise<Rank[]> {
    try {
      const ranks = await this.findAll()
      return ranks
        .filter((rank) => rank.hierarchy < hierarchy)
        .sort((a, b) => a.hierarchy - b.hierarchy)
    } catch (error) {
      console.error(`Erro ao buscar ranks superiores a ${hierarchy}:`, error)
      throw error
    }
  }

  // Buscar ranks subordinados a uma determinada hierarquia
  async findSubordinate(hierarchy: number): Promise<Rank[]> {
    try {
      const ranks = await this.findAll()
      return ranks
        .filter((rank) => rank.hierarchy > hierarchy)
        .sort((a, b) => a.hierarchy - b.hierarchy)
    } catch (error) {
      console.error(`Erro ao buscar ranks subordinados a ${hierarchy}:`, error)
      throw error
    }
  }
}

// Instância única do serviço
export const rankService = new RankService()
