import { defineStore } from 'pinia'

type militaryOrganizationState = {
  militaryOrganizations: militaryOrganization[]
  selectedMilitaryOrganization: militaryOrganization | null
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

    updateMilitaryOrganization(updatedDataMilitaryOrganization: militaryOrganization) {
      const militaryOrganizationIndex = this.militaryOrganizations.findIndex(
        (militaryOrganization: militaryOrganization) => militaryOrganization.id === updatedDataMilitaryOrganization.id,
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
      this.militaryOrganizations = militaryOrganizations
    },

    setSelectedMilitaryOrganization(militaryOrganization: militaryOrganization) {
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

    deleteMilitaryOrganizationLogo(militaryOrganization: militaryOrganization) {
      const id = militaryOrganization.id
      const index = this.militaryOrganizations.findIndex(
        (militaryOrganization) => militaryOrganization.id === id,
      )
      if (index !== -1) {
        this.militaryOrganizations[index] = {
          ...this.militaryOrganizations[index],
          logo: militaryOrganization.logo ?? '/logos/default/default.png',
        }
      }
    },

    addSectionToMilitaryOrganization(militaryOrganizationId: string, newSection: section) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex(mo => mo.id === militaryOrganizationId)
      if (moIndex !== -1) {
        this.militaryOrganizations[moIndex] = {
          ...this.militaryOrganizations[moIndex],
          sections: [...(this.militaryOrganizations[moIndex].sections || []), newSection]
        }
      }
      
      // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
      if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
        this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
      }
    },

    removeSectionFromMilitaryOrganization(militaryOrganizationId: string, sectionId: string) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex(mo => mo.id === militaryOrganizationId)
      if (moIndex !== -1) {
        this.militaryOrganizations[moIndex] = {
          ...this.militaryOrganizations[moIndex],
          sections: (this.militaryOrganizations[moIndex].sections || []).filter(section => section.id !== sectionId)
        }
      }
      
      // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
      if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
        this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
      }
    },

    updateSectionInMilitaryOrganization(militaryOrganizationId: string, updatedSection: section) {
      // Atualizar no array militaryOrganizations
      const moIndex = this.militaryOrganizations.findIndex(mo => mo.id === militaryOrganizationId)
      if (moIndex !== -1 && this.militaryOrganizations[moIndex].sections) {
        const sectionIndex = this.militaryOrganizations[moIndex].sections!.findIndex(section => section.id === updatedSection.id)
        if (sectionIndex !== -1) {
          this.militaryOrganizations[moIndex] = {
            ...this.militaryOrganizations[moIndex],
            sections: [
              ...this.militaryOrganizations[moIndex].sections!.slice(0, sectionIndex),
              updatedSection,
              ...this.militaryOrganizations[moIndex].sections!.slice(sectionIndex + 1)
            ]
          }
        }
      }
      
      // Atualizar selectedMilitaryOrganization se for a mesma (usa a referência atualizada)
      if (this.selectedMilitaryOrganization?.id === militaryOrganizationId) {
        this.selectedMilitaryOrganization = this.militaryOrganizations[moIndex]
      }
    },

  },

  getters: {
    totalMilitaryOrganizations: (state) => state.militaryOrganizations.length,
  },
})
