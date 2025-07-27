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
        this.militaryOrganizations[militaryOrganizationIndex] = {
          ...this.militaryOrganizations[militaryOrganizationIndex],
          ...updatedDataMilitaryOrganization,
        }
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

  },

  getters: {
    totalMilitaryOrganizations: (state) => state.militaryOrganizations.length,
  },
})
