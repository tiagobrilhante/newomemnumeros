import { defineStore } from 'pinia'

export const useSectionFunctionUserStore = defineStore('sectionFunctionUser', () => {
  // Implementação temporária - precisa ser implementada adequadamente
  const sectionFunctionUsers = ref([])
  const selectedSectionFunctionUser = ref(null)
  const loading = ref(false)

  const clearState = () => {
    sectionFunctionUsers.value = []
    selectedSectionFunctionUser.value = null
  }

  return {
    sectionFunctionUsers,
    selectedSectionFunctionUser,
    loading,
    clearState
  }
})