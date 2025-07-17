import { defineStore } from 'pinia'
import { militaryOrganizationService } from '~/services/militaryOrganizationsService'
import type {
  militaryOrganization,
  updatedMilitaryOrganization,
  createdMilitaryOrganization,
} from '~/types/core/organization'

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
    async fetchMilitaryOrganizations() {
      this.loading = true
      this.error = null

      try {
        this.militaryOrganizations = await militaryOrganizationService.findAll()
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Organizações Militares'
        }
      } finally {
        this.loading = false
      }
    },

    async addMilitaryOrganization(newMilitaryOrganizationData: createdMilitaryOrganization) {
      this.loading = true
      this.error = null

      try {
        const createdMilitaryOrganization = await militaryOrganizationService.create(
          newMilitaryOrganizationData
        )

        this.militaryOrganizations.push(createdMilitaryOrganization)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao adicionar usuário'
        }
      } finally {
        this.loading = false
      }
    },

    async updateMilitaryOrganization(updatedDataMilitaryOrganization: updatedMilitaryOrganization) {
      this.loading = true
      this.error = null

      try {
        const updatedMilitaryOrganization = await militaryOrganizationService.update(
          updatedDataMilitaryOrganization
        )
        const militaryOrganizationIndex = this.militaryOrganizations.findIndex(
          (militaryOrganization) => militaryOrganization.id === updatedDataMilitaryOrganization.id
        )
        if (militaryOrganizationIndex !== -1) {
          this.militaryOrganizations[militaryOrganizationIndex] = {
            ...this.militaryOrganizations[militaryOrganizationIndex],
            ...updatedMilitaryOrganization,
          }
        }
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao atualizar Organização Militar'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteMilitaryOrganization(militaryOrganizationId: string) {
      this.loading = true
      this.error = null
      try {
        await militaryOrganizationService.delete(militaryOrganizationId)
        this.militaryOrganizations = this.militaryOrganizations.filter(
          (militaryOrganization) => militaryOrganization.id !== militaryOrganizationId
        )
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao excluir Organização Militar'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteMilitaryOrganizationLogo(militaryOrganizationId: string) {
      this.loading = true
      this.error = null
      try {
        const updatedMilitaryOrganization =
          await militaryOrganizationService.deleteLogo(militaryOrganizationId)
        const index = this.militaryOrganizations.findIndex(
          (militaryOrganization) => militaryOrganization.id === militaryOrganizationId
        )
        if (index !== -1) {
          this.militaryOrganizations[index] = {
            ...this.militaryOrganizations[index],
            logo: updatedMilitaryOrganization.logo ?? '/logos/default/default.png',
          }
        }
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao excluir Logo da Organização Militar'
        }
      } finally {
        this.loading = false
      }
    },

    async findMilitaryOrganization(militaryOrganizationId: number) {
      this.loading = true
      this.error = null
      try {
        this.selectedMilitaryOrganization =
          await militaryOrganizationService.findById(militaryOrganizationId)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Organização Militar'
        }
      } finally {
        this.loading = false
      }
    },

    setSelectedMilitaryOrganization(militaryOrganization: militaryOrganization) {
      this.selectedMilitaryOrganization = militaryOrganization
    },

    clearSelectedMilitaryOrganization() {
      this.selectedMilitaryOrganization = null
    },

    clearMilitaryOrganizationState() {
      this.militaryOrganizations = []
      this.selectedMilitaryOrganization = null
      this.loading = false
      this.error = null
    },
  },

  getters: {
    totalMilitaryOrganizations: (state) => state.militaryOrganizations.length,
  },
})
