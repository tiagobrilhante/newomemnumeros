class MilitaryOrganizationService {
  private baseURL = '/api/military-organizations'

  async findAll(): Promise<ApiResponse<militaryOrganization[]>> {
    try {
      return await $fetch<ApiResponse<militaryOrganization[]>>(this.baseURL, {
        params: {
          include: {
            parentOrganization: true,
            sections: true
          },
        },
      })
    } catch (error) {
      console.error('Erro ao buscar organizações Militares:', error)
      throw error
    }
  }

  async findById(id: string): Promise<ApiResponse<militaryOrganization | null>> {
    try {
      return await $fetch<ApiResponse<militaryOrganization | null>>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar Organização Militar ${id}:`, error)
      throw error
    }
  }

  async create(data: militaryOrganization): Promise<ApiResponse<militaryOrganization>> {
    try {
      return await $fetch<ApiResponse<militaryOrganization>>(this.baseURL, {
        method: 'POST',
        body: data,
        params: {
          include: {
            parentOrganization: true,
            subOrganizations: true,
          },
        },
      })
    } catch (error) {
      console.error('Erro ao criar organização Militar:', error)
      throw error
    }
  }

  async update(data: militaryOrganization): Promise<ApiResponse<militaryOrganization>> {
    try {
      return await $fetch<ApiResponse<militaryOrganization>>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar Organização Militar ${data.id}:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      return await $fetch<ApiResponse<void>>(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar organização Militar ${id}:`, error)
      throw error
    }
  }

  async deleteLogo(id: string): Promise<ApiResponse<militaryOrganization>> {
    try {
      return await $fetch<ApiResponse<militaryOrganization>>(`${this.baseURL}/delete-logo/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar logo de organização Militar ${id}:`, error)
      throw error
    }
  }
}

export const militaryOrganizationService = new MilitaryOrganizationService()
