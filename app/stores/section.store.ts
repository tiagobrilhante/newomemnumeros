import { defineStore } from 'pinia'

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

    updateSection(updatedDataSection: section) {
      const sectionIndex = this.sections.findIndex(
        (section: section) => section.id === updatedDataSection.id,
      )
      if (sectionIndex !== -1) {
        this.sections.splice(sectionIndex, 1, updatedDataSection)
      }
    },

    setSections(sections: section[]) {
      this.sections = sections
    },

    setSelectedSection(section: section) {
      this.selectedSection = section
    },

    clearSelectedSection() {
      this.selectedSection = null
    },

    clearDeletedSection(id: string) {
      this.sections = this.sections.filter(
        (section) => section.id !== id,
      )
    },

    clearSectionState() {
      this.sections = []
      this.selectedSection = null
      this.loading = false
      this.error = null
    },

  },

  getters: {
    totalSections: (state) => state.sections.length,
  },
})
