class SectionService {
  private baseURL = '/api/sections'

  async findAll(): Promise<ApiResponse<section[]>> {
    try {
      return await $fetch<ApiResponse<section[]>>(this.baseURL)
    } catch (error) {
      console.error('Erro ao buscar Seções:', error)
      throw error
    }
  }

  async findAllByMilitaryOrganizationId(id: string): Promise<ApiResponse<section[]>> {
    try {
      return await $fetch<Promise<ApiResponse<section[]>>>(`${this.baseURL}/by-om-id/${id}`)
    } catch (error) {
      console.error('Erro ao buscar Seções:', error)
      throw error
    }
  }

  async findById(id: string): Promise<ApiResponse<section | null>> {
    try {
      return await $fetch<ApiResponse<section | null>>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar Seção ${id}:`, error)
      throw error
    }
  }

  async create(data: section): Promise<ApiResponse<section>> {
    try {
      return await $fetch<Promise<ApiResponse<section>>>(this.baseURL, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      console.error('Erro ao criar Seção:', error)
      throw error
    }
  }

  async update(data: section): Promise<ApiResponse<section>> {
    try {
      return await $fetch<Promise<ApiResponse<section>>>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar Seção ${data.id}:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      return await $fetch<ApiResponse<void>>(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar Seção ${id}:`, error)
      throw error
    }
  }
}

export const sectionService = new SectionService()
