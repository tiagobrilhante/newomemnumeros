import type {militaryOrganization } from '~/types/military-organization'

class MilitaryOrganizationService {
  private baseURL = '/api/military-organizations'

  async findAll(): Promise<militaryOrganization[]> {
    try {

      const teste =  await $fetch<militaryOrganization[]>(this.baseURL, {
        params: {
          include: {
            parentOrganization: true,
          },
        },
      })

      console.log('teste')
      console.log(teste)
      console.log('teste')

      return teste
    } catch (error) {
      console.error('Erro ao buscar organizações Militares:', error)
      throw error
    }
  }

  async findById(id: string): Promise<militaryOrganization | null> {
    try {
      return await $fetch<militaryOrganization>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar Organização Militar ${id}:`, error)
      throw error
    }
  }

  async create(data: militaryOrganization): Promise<militaryOrganization> {
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

  async update(data: militaryOrganization): Promise<militaryOrganization> {
    try {
      return await $fetch<militaryOrganization>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar Organização Militar ${data.id}:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await $fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar organização Militar ${id}:`, error)
      throw error
    }
  }

  async deleteLogo(id: string): Promise<militaryOrganization> {
    try {
      return await $fetch<militaryOrganization>(`${this.baseURL}/delete-logo/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar logo de organização Militar ${id}:`, error)
      throw error
    }
  }
}

export const militaryOrganizationService = new MilitaryOrganizationService()
