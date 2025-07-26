import { defineStore } from 'pinia'
import { sectionsService } from '~/services/sectionsService'
import type { section } from '~/types/sections'

type sectionState = {
  sections: section[]
  selectedSection: section | null
  loading: boolean
  error: string | null
}

export const useSectionStore = defineStore('sectionStore', {
  state: (): sectionState => ({
    sections: [],
    selectedSection: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSections() {
      this.loading = true
      this.error = null

      try {
        this.sections = await sectionsService.findAll()
        return this.sections
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Seções'
        }
      } finally {
        this.loading = false
      }
    },

    async fetchSectionsByMilitaryOrganizationId(id: string) {
      this.loading = true
      this.error = null

      try {
        this.sections = await sectionsService.findAllByMilitaryOrganizationId(id)
        return this.sections
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Seções'
        }
      } finally {
        this.loading = false
      }
    },

    async addSection(newSectionData: section) {
      this.loading = true
      this.error = null

      try {
        const createdSection = await sectionsService.create(newSectionData)
        this.sections.push(createdSection)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao adicionar Seção'
        }
      } finally {
        this.loading = false
      }
    },

    async updateSection(updatedDataSection: section) {
      this.loading = true
      this.error = null

      try {
        const updatedSection = await sectionsService.update(updatedDataSection)
        const sectionIndex = this.sections.findIndex(
          (section) => section.id === updatedDataSection.id
        )
        if (sectionIndex !== -1) {
          this.sections[sectionIndex] = updatedSection
        }
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao atualizar Seção'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteSection(sectionId: string) {
      this.loading = true
      this.error = null
      try {
        await sectionsService.delete(sectionId)
        this.sections = this.sections.filter((section) => section.id !== sectionId)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao excluir Seção'
        }
      } finally {
        this.loading = false
      }
    },

    async findSection(sectionId: string) {
      this.loading = true
      this.error = null
      try {
        this.selectedSection = await sectionsService.findById(sectionId)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Seção'
        }
      } finally {
        this.loading = false
      }
    },

    setSelectedSection(section: section) {
      this.selectedSection = section
    },

    clearSelectedSection() {
      this.selectedSection = null
    },
  },

  getters: {
    totalSections: (state) => state.sections.length,
  },
})
