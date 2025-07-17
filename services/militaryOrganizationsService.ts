import type {
  createdMilitaryOrganization,
  militaryOrganization,
  updatedMilitaryOrganization,
} from '~/types/core/organization'

class MilitaryOrganizationService {
  private baseURL = '/api/military-organizations'

  // Buscar todas as Organizações Militares
  async findAll(): Promise<militaryOrganization[]> {
    try {
      return await $fetch<militaryOrganization[]>(this.baseURL, {
        params: {
          include: {
            parentOrganization: true,
          },
        },
      })
    } catch (error) {
      console.error('Erro ao buscar organizações Militares:', error)
      throw error
    }
  }

  // Buscar Organizações Militares por ID
  async findById(id: string): Promise<militaryOrganization | null> {
    try {
      return await $fetch<militaryOrganization>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar Organização Militar ${id}:`, error)
      throw error
    }
  }

  // Criar nova organização militar
  async create(data: createdMilitaryOrganization): Promise<militaryOrganization> {
    try {
      return await $fetch<militaryOrganization>(this.baseURL, {
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

  // Atualizar Organização Militar
  async update(data: updatedMilitaryOrganization): Promise<updatedMilitaryOrganization> {
    try {
      return await $fetch<updatedMilitaryOrganization>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar Organização Militar ${data.id}:`, error)
      throw error
    }
  }

  // Deletar Organização Militar
  async delete(id: string): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar organização Militar ${id}:`, error)
      throw error
    }
  }

  // Deletar Logo Organização Militar
  async deleteLogo(id: string): Promise<updatedMilitaryOrganization> {
    try {
      return await $fetch<updatedMilitaryOrganization>(`${this.baseURL}/delete-logo/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar logo de organização Militar ${id}:`, error)
      throw error
    }
  }
}

// Instância única do serviço
export const militaryOrganizationService = new MilitaryOrganizationService()
