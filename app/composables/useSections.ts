import { toast } from 'vue3-toastify'
import { useSectionStore } from '~/stores/section.store'
import { createAppError, type ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { sectionService } from '~/services/section.service'

interface SectionFilters {
  militaryOrganizationId?: string
  search?: string
}

// noinspection JSUnusedGlobalSymbols
export const useSections = () => {
  const store = useSectionStore()
  const militaryOrgComposable = useMilitaryOrganizations()
  const { $i18n } = useNuxtApp()

  const loading = ref(false)
  const error = ref('')

  const getTranslatedMessage = (key: string, fallback: string): string => {
    try {
      return $i18n?.t(key) || fallback
    } catch {
      return fallback
    }
  }

  const createSectionError = (messageKey: string, fallbackMessage: string, statusCode = 500) => {
    return createAppError(messageKey, {
      statusCode,
      statusMessageKey: 'errors.genericTitle',
      fallbackStatusMessage: 'Section Error',
      fallbackMessage,
    } satisfies ErrorHandlerOptions)
  }

  const sections = computed(() => store.sections)
  const selectedSection = computed(() => store.selectedSection)
  const totalSections = computed(() => store.totalSections)

  const sectionsByOM = computed(() => (militaryOrganizationId: string) =>
    sections.value.filter(section => section.militaryOrganizationId === militaryOrganizationId),
  )

  const fetchSections = async (): Promise<section[]> => {
    loading.value = true
    error.value = ''

    try {
      const response = await sectionService.findAll()

      if (!response.success) {
        throw createSectionError(
          'errors.serverCommunication',
          response.message || 'Erro ao carregar seções',
          response.statusCode || 500,
        )
      }
      store.setSections(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const fetchSectionsByOM = async (militaryOrganizationId: string): Promise<section[]> => {
    if (!militaryOrganizationId) {
      throw createSectionError(
        'errors.invalidDataProvided',
        'ID da organização militar é obrigatório',
        400,
      )
    }

    try {
      const response = await sectionService.findAllByMilitaryOrganizationId(militaryOrganizationId)

      if (!response.success) {
        throw createSectionError(
          'errors.serverCommunication',
          response.message || 'Erro ao carregar seções',
          response.statusCode || 500,
        )
      }
      store.setSections(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const createSection = async (data: section): Promise<void> => {
    if (!data.name?.trim() || !data.acronym?.trim() || !data.militaryOrganizationId) {
      const appError = createSectionError(
        'errors.allFieldsRequired',
        'Todos os campos são obrigatórios',
        400,
      )
      toast.error(appError.message)
      return
    }

    const existingSection = sections.value.find(
      s => s.acronym.toLowerCase() === data.acronym.toLowerCase()
        && s.militaryOrganizationId === data.militaryOrganizationId,
    )

    if (existingSection) {
      const appError = createSectionError(
        'errors.duplicateEntry',
        'Já existe uma seção com esta sigla nesta organização',
        409,
      )
      toast.error(appError.message)
      return
    }

    loading.value = true
    error.value = ''

    try {
      const sectionData: section = {
        name: data.name.trim(),
        acronym: data.acronym.trim(),  // Manter case original
        militaryOrganizationId: data.militaryOrganizationId,
      }

      const response = await sectionService.create(sectionData)

      if (response.success) {
        store.sections.push(response.data)

        if (militaryOrgComposable.addSectionToMilitaryOrganization) {
          militaryOrgComposable.addSectionToMilitaryOrganization(data.militaryOrganizationId, response.data)
        }

        const successMessage = getTranslatedMessage(
          'success.sectionCreated',
          'Seção criada com sucesso!',
        )
        toast.success(successMessage)
      }
    } catch (error: any) {
      console.error('Erro ao criar seção:', error)

      if (error?.statusCode === 409) {
        const appError = createSectionError(
          'errors.duplicateEntry',
          error.message || 'Já existe uma seção com esta sigla nesta organização',
          409
        )
        toast.error(appError.message)
        return
      }

      const appError = createSectionError(
        'errors.serverCommunication',
        error.message || 'Erro ao criar seção',
        error?.statusCode || 500
      )
      toast.error(appError.message)
      return
    } finally {
      loading.value = false
    }
  }

  const updateSection = async (data: section): Promise<void> => {
    if (!data.id || !data.name?.trim() || !data.acronym?.trim() || !data.militaryOrganizationId) {
      const appError = createSectionError(
        'errors.allFieldsRequired',
        'Todos os campos são obrigatórios',
        400,
      )
      toast.error(appError.message)
      return
    }

    const existingSection = sections.value.find(
      s => s.id !== data.id
        && s.acronym.toLowerCase() === data.acronym.toLowerCase()
        && s.militaryOrganizationId === data.militaryOrganizationId,
    )

    if (existingSection) {
      const appError = createSectionError(
        'errors.duplicateEntry',
        'Já existe uma seção com esta sigla nesta organização',
        409,
      )
      toast.error(appError.message)
      return
    }

    loading.value = true
    error.value = ''

    try {
      const response = await sectionService.update(data)

      if (response.success){
        // Atualizar a store de sections
        store.updateSection(response.data)

        // Atualizar a militaryOrganization store
        if (militaryOrgComposable.updateSectionInMilitaryOrganization) {
          militaryOrgComposable.updateSectionInMilitaryOrganization(data.militaryOrganizationId, response.data)
        }

        const successMessage = getTranslatedMessage(
          'success.sectionUpdated',
          'Seção atualizada com sucesso!',
        )
        toast.success(successMessage)
      }

    } catch (error: any) {
      console.error('Erro ao atualizar seção:', error)

      // Se for erro 409 (duplicata), usar mensagem específica
      if (error?.statusCode === 409) {
        const appError = createSectionError(
          'errors.duplicateEntry',
          error.message || 'Já existe uma seção com esta sigla nesta organização',
          409
        )
        toast.error(appError.message)
        return
      }

      const appError = createSectionError(
        'errors.serverCommunication',
        error.message || 'Erro ao atualizar seção',
        error?.statusCode || 500
      )
      toast.error(appError.message)
      return
    } finally {
      loading.value = false
    }
  }

  const deleteSection = async (id: string): Promise<void> => {
    if (!id) {
      const appError = createSectionError(
        'errors.invalidId',
        'ID da seção é obrigatório',
        400,
      )
      toast.error(appError.message)
      throw appError
    }

    // Buscar a seção na store local ou usar a selectedMilitaryOrganization
    const sectionToDelete = sections.value.find(s => s.id === id)
    const selectedMO = militaryOrgComposable.selectedMilitaryOrganization?.value

    loading.value = true
    error.value = ''

    try {
      const response = await sectionService.delete(id)

      if (response.success) {
        store.clearDeletedSection(id)

        if (militaryOrgComposable.removeSectionFromMilitaryOrganization) {
          if (sectionToDelete) {
            militaryOrgComposable.removeSectionFromMilitaryOrganization(sectionToDelete.militaryOrganizationId, id)
          }
          else if (selectedMO && selectedMO.id) {
            militaryOrgComposable.removeSectionFromMilitaryOrganization(selectedMO.id, id)
          }
        }

        const successMessage = getTranslatedMessage(
          'success.sectionDeleted',
          'Seção excluída com sucesso!',
        )
        toast.success(successMessage)
      }

    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao excluir seção',
      )
      toast.error(appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const findSection = async (id: string): Promise<section> => {
    if (!id) {
      throw createSectionError(
        'errors.invalidId',
        'ID da seção é obrigatório',
        400,
      )
    }

    const cached = store.sections.find(section => section.id === id)

    if (cached) {
      store.setSelectedSection(cached)
      return cached
    }
    loading.value = true
    error.value = ''

    try {

      let resp: ApiResponse<section | null>

      try {
        resp = await sectionService.findById(id)
      } catch (e: any) {
        error.value = e.message ?? 'Falha de comunicação'
        throw createSectionError(
          'errors.serverCommunication',
          'Erro ao comunicar com o servidor',
        )
      }

      if (!resp.success || !resp.data) {
        throw createSectionError(
          'errors.recordNotFound',
          resp.message || 'Seção militar não encontrada',
          resp.statusCode || 404,
        )
      }

      const data = resp.data
      const idx = store.sections.findIndex(section => section.id === id)
      idx >= 0
        ? store.sections.splice(idx, 1, data)
        : store.sections.push(data)

      store.setSelectedSection(data)
      return data
    } finally {
      loading.value = false
    }
  }

  const selectSection = (section: section | null): void => {
    if (section) {
      store.setSelectedSection(section)
    } else {
      store.clearSelectedSection()
    }
  }

  const clearSelection = (): void => {
    store.clearSelectedSection()
  }
  const clearState = (): void => {
    store.clearSectionState()
  }

  const filterSections = (filters: SectionFilters) => {
    return computed(() => {
      let filtered = sections.value

      if (filters.militaryOrganizationId) {
        filtered = filtered.filter(
          section => section.militaryOrganizationId === filters.militaryOrganizationId,
        )
      }

      if (filters.search?.trim()) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          section =>
            section.name.toLowerCase().includes(searchTerm) ||
            section.acronym.toLowerCase().includes(searchTerm),
        )
      }

      return filtered
    })
  }

  const isAcronymTaken = (acronym: string, militaryOrganizationId: string, excludeId?: string): boolean => {
    return sections.value.some(
      section =>
        section.id !== excludeId &&
        section.acronym.toLowerCase() === acronym.toLowerCase() &&
        section.militaryOrganizationId === militaryOrganizationId,
    )
  }

  const getSectionStats = () => {
    return computed(() => ({
      total: sections.value.length,
      byOrganization: sections.value.reduce((acc, section) => {
        const omId = section.militaryOrganizationId
        acc[omId] = (acc[omId] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }))
  }

  const getSectionById = (id: string): section | undefined => {
    return sections.value.find(section => section.id === id)
  }


  return {
    sections: readonly(sections),
    selectedSection: readonly(selectedSection),
    loading: readonly(loading),
    error: readonly(error),
    totalSections: readonly(totalSections),
    sectionsByOM: readonly(sectionsByOM),

    selectSection,
    clearState,
    clearSelection,

    fetchSections,
    fetchSectionsByOM,
    createSection,
    updateSection,
    deleteSection,
    findSection,

    filterSections,
    isAcronymTaken,
    getSectionStats,
    getSectionById
  }
}
