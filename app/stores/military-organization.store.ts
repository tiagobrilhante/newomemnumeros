import { defineStore } from 'pinia'
import type { militaryOrganization, MilitaryOrganizationMutable } from '#shared/types/military-organization'
import type { SectionMutable } from '#shared/types/sections'

// Helper para converter readonly para mutable
const toMutable = (mo: militaryOrganization): MilitaryOrganizationMutable => ({
  id: mo.id,
  name: mo.name,
  acronym: mo.acronym,
  color: mo.color,
  logo: mo.logo,
  sections: mo.sections?.map(s => ({
    id: s.id,
    name: s.name,
    acronym: s.acronym,
    militaryOrganizationId: s.militaryOrganizationId
  })) || [],
  militaryOrganizationId: mo.militaryOrganizationId,
  parentOrganization: mo.parentOrganization ? toMutable(mo.parentOrganization) : undefined,
  militaryOrganizations: mo.militaryOrganizations?.map(toMutable) || [],
  subOrganizationsCount: mo.subOrganizationsCount,
  usersCount: mo.usersCount
})

type militaryOrganizationState = {
  militaryOrganizations: MilitaryOrganizationMutable[]
  selectedMilitaryOrganization: MilitaryOrganizationMutable | null
  loading: boolean
  error: string | null
}

export const useMilitaryOrganizationStore = defineStore('militaryOrganizationStore', {
  state: (): militaryOrganizationState => ({
    militaryOrganizations: [],
    selectedMilitaryOrganization: null,
    loading: false,
    error: null,
  }),

  actions: {

    updateMilitaryOrganization(updatedDataMilitaryOrganization: MilitaryOrganizationMutable) {
      const militaryOrganizationIndex = this.militaryOrganizations.findIndex(
        (militaryOrganization: MilitaryOrganizationMutable) => militaryOrganization.id === updatedDataMilitaryOrganization.id,
      )
      if (militaryOrganizationIndex !== -1) {
        this.militaryOrganizations.splice(militaryOrganizationIndex, 1, updatedDataMilitaryOrganization)
      }
      
      // Atualiza também selectedMilitaryOrganization se for a mesma
      if (this.selectedMilitaryOrganization?.id === updatedDataMilitaryOrganization.id) {
        this.selectedMilitaryOrganization = updatedDataMilitaryOrganization
      }
    },

    setMilitaryOrganizations(militaryOrganizations: militaryOrganization[]) {
      // Converte readonly para mutable para uso interno do store
      this.militaryOrganizations = militaryOrganizations.map(toMutable)
    },

    setSelectedMilitaryOrganization(militaryOrganization: MilitaryOrganizationMutable) {
      this.selectedMilitaryOrganization = militaryOrganization
    },

    clearSelectedMilitaryOrganization() {
      this.selectedMilitaryOrganization = null
    },

    clearDeletedMilitaryOrganization(id: string) {
      this.militaryOrganizations = this.militaryOrganizations.filter(
        (militaryOrganization) => militaryOrganization.id !== id,
      )
    },

    clearMilitaryOrganizationState() {
      this.militaryOrganizations = []
      this.selectedMilitaryOrganization = null
      this.loading = false
      this.error = null
    },

    deleteMilitaryOrganizationLogo(militaryOrganization: MilitaryOrganizationMutable) {
      const id = militaryOrganization.id
      const index = this.militaryOrganizations.findIndex(
        (militaryOrganization) => militaryOrganization.id === id,
      )
      if (index !== -1) {
        this.militaryOrganizations[index] = {
          ...this.militaryOrganizations[index],
          logo: militaryOrganization.logo ?? '/logos/default/default.png',
        } as MilitaryOrganizationMutable
      }
    },

    addSectionToMilitaryOrganization(militaryOrganizationId: string, newSection: SectionMutable) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex((mo: MilitaryOrganizationMutable) => mo.id === militaryOrganizationId)
      if (moIndex !== -1) {
        const currentMO = this.militaryOrganizations[moIndex]
        if (currentMO) {
          this.militaryOrganizations[moIndex] = {
            ...currentMO,
            sections: [...(currentMO.sections || []), newSection]
          } as MilitaryOrganizationMutable
        
          // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
          if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
            this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
          }
        }
      }
    },

    removeSectionFromMilitaryOrganization(militaryOrganizationId: string, sectionId: string) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex((mo: MilitaryOrganizationMutable) => mo.id === militaryOrganizationId)
      if (moIndex !== -1) {
        const currentMO = this.militaryOrganizations[moIndex]
        if (currentMO) {
          this.militaryOrganizations[moIndex] = {
            ...currentMO,
            sections: (currentMO.sections || []).filter((section: SectionMutable) => section.id !== sectionId)
          } as MilitaryOrganizationMutable
        
          // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
          if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
            this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
          }
        }
      }
    },

    updateSectionInMilitaryOrganization(militaryOrganizationId: string, updatedSection: SectionMutable) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex((mo: MilitaryOrganizationMutable) => mo.id === militaryOrganizationId)
      if (moIndex !== -1) {
        const currentMO = this.militaryOrganizations[moIndex]
        if (currentMO && currentMO.sections) {
          const sections = currentMO.sections
          const sectionIndex = sections.findIndex((section: SectionMutable) => section.id === updatedSection.id)
          if (sectionIndex !== -1) {
            this.militaryOrganizations[moIndex] = {
              ...currentMO,
              sections: [
                ...sections.slice(0, sectionIndex),
                updatedSection,
                ...sections.slice(sectionIndex + 1)
              ]
            } as MilitaryOrganizationMutable
          
            // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
            if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
              this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
            }
          }
        }
      }
    },

  },

  getters: {
    totalMilitaryOrganizations: (state) => state.militaryOrganizations.length,
  },
})
