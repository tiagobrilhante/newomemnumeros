import type { createdSection, updatedSection, section } from '~/types/core/organization'

class SectionService {
  private baseURL = '/api/sections'

  // Buscar todas as Seções
  async findAll(): Promise<section[]> {
    try {
      return await $fetch<section[]>(this.baseURL)
    } catch (error) {
      console.error('Erro ao buscar Seções:', error)
      throw error
    }
  }

  async findAllByMilitaryOrganizationId(id: string): Promise<section[]> {
    try {
      return await $fetch<section[]>(`${this.baseURL}/by-om-id/${id}`)
    } catch (error) {
      console.error('Erro ao buscar Seções:', error)
      throw error
    }
  }

  // Buscar Seção por ID
  async findById(id: string): Promise<section | null> {
    try {
      return await $fetch<section>(`${this.baseURL}/${id}`)
    } catch (error) {
      console.error(`Erro ao buscar Seção ${id}:`, error)
      throw error
    }
  }

  // Criar nova Seção
  async create(data: createdSection): Promise<section> {
    try {
      return await $fetch<section>(this.baseURL, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      console.error('Erro ao criar organização Militar:', error)
      throw error
    }
  }

  // Atualizar Seção
  async update(data: updatedSection): Promise<section> {
    try {
      return await $fetch<section>(`${this.baseURL}/${data.id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (error) {
      console.error(`Erro ao atualizar Seção ${data.id}:`, error)
      throw error
    }
  }

  // Deletar Seção
  async delete(id: string): Promise<void> {
    try {
      await $fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Erro ao deletar Seção ${id}:`, error)
      throw error
    }
  }
}

// Instância única do serviço
export const sectionsService = new SectionService()
