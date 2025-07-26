import type { section } from '~/types/sections'
import { useSectionStore } from '~/stores/section.store'
import { createAppError, type ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { toast } from 'vue3-toastify'

// Tipos específicos para o composable
interface CreateSectionData {
  name: string
  acronym: string
  militaryOrganizationId: string
}

interface UpdateSectionData extends CreateSectionData {
  id: string
}

interface SectionFilters {
  militaryOrganizationId?: string
  search?: string
}

/**
 * Composable para gerenciamento de seções
 * Abstrai a complexidade do store e centraliza business logic
 */
export const useSections = () => {
  const store = useSectionStore()
  const { $i18n } = useNuxtApp()

  // Helper para obter mensagens traduzidas
  const getTranslatedMessage = (key: string, fallback: string): string => {
    try {
      return $i18n?.t(key) || fallback
    } catch {
      return fallback
    }
  }

  // Helper para criar erros padronizados
  const createSectionError = (messageKey: string, fallbackMessage: string, statusCode = 500) => {
    return createAppError(messageKey, {
      statusCode,
      statusMessageKey: 'errors.genericTitle',
      fallbackStatusMessage: 'Section Error',
      fallbackMessage
    } satisfies ErrorHandlerOptions)
  }

  // =====================================
  // COMPUTED PROPERTIES (Estado Reativo)
  // =====================================

  const sections = computed(() => store.sections)
  const selectedSection = computed(() => store.selectedSection)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)
  const totalSections = computed(() => store.totalSections)

  // Seções filtradas por organização militar
  const sectionsByOM = computed(() => (militaryOrganizationId: string) => 
    sections.value.filter(section => section.militaryOrganizationId === militaryOrganizationId)
  )

  // =====================================
  // OPERAÇÕES CRUD (Business Logic)
  // =====================================

  /**
   * Busca todas as seções
   */
  const fetchSections = async (): Promise<section[]> => {
    try {
      const result = await store.fetchSections()
      return result || []
    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao carregar seções'
      )
      console.error('Fetch sections error:', appError.message)
      throw appError
    }
  }

  /**
   * Busca seções por organização militar
   */
  const fetchSectionsByOM = async (militaryOrganizationId: string): Promise<section[]> => {
    if (!militaryOrganizationId) {
      const appError = createSectionError(
        'errors.invalidDataProvided',
        'ID da organização militar é obrigatório',
        400
      )
      throw appError
    }

    try {
      const result = await store.fetchSectionsByMilitaryOrganizationId(militaryOrganizationId)
      return result || []
    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao carregar seções da organização'
      )
      console.error('Fetch sections by OM error:', appError.message)
      throw appError
    }
  }

  /**
   * Cria uma nova seção
   */
  const createSection = async (data: CreateSectionData): Promise<void> => {
    // Validação de entrada
    if (!data.name?.trim() || !data.acronym?.trim() || !data.militaryOrganizationId) {
      const appError = createSectionError(
        'errors.allFieldsRequired',
        'Todos os campos são obrigatórios',
        400
      )
      toast.error(appError.message)
      throw appError
    }

    // Validação de duplicação de sigla
    const existingSection = sections.value.find(
      s => s.acronym.toLowerCase() === data.acronym.toLowerCase() 
        && s.militaryOrganizationId === data.militaryOrganizationId
    )

    if (existingSection) {
      const appError = createSectionError(
        'errors.duplicateEntry',
        'Já existe uma seção com esta sigla nesta organização',
        409
      )
      toast.error(appError.message)
      throw appError
    }

    try {
      // Preparar dados para o store
      const sectionData: section = {
        name: data.name.trim(),
        acronym: data.acronym.trim().toUpperCase(),
        militaryOrganizationId: data.militaryOrganizationId,
        militaryOrganization: {} as any // O store/service deve lidar com isso
      }

      await store.addSection(sectionData)

      // Feedback de sucesso
      const successMessage = getTranslatedMessage(
        'success.sectionCreated',
        'Seção criada com sucesso!'
      )
      toast.success(successMessage)

    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao criar seção'
      )
      toast.error(appError.message)
      throw appError
    }
  }

  /**
   * Atualiza uma seção existente
   */
  const updateSection = async (data: UpdateSectionData): Promise<void> => {
    // Validação de entrada
    if (!data.id || !data.name?.trim() || !data.acronym?.trim() || !data.militaryOrganizationId) {
      const appError = createSectionError(
        'errors.allFieldsRequired',
        'Todos os campos são obrigatórios',
        400
      )
      toast.error(appError.message)
      throw appError
    }

    // Validação de duplicação de sigla (excluindo a seção atual)
    const existingSection = sections.value.find(
      s => s.id !== data.id
        && s.acronym.toLowerCase() === data.acronym.toLowerCase() 
        && s.militaryOrganizationId === data.militaryOrganizationId
    )

    if (existingSection) {
      const appError = createSectionError(
        'errors.duplicateEntry',
        'Já existe uma seção com esta sigla nesta organização',
        409
      )
      toast.error(appError.message)
      throw appError
    }

    try {
      // Preparar dados para o store
      const sectionData: section = {
        id: data.id,
        name: data.name.trim(),
        acronym: data.acronym.trim().toUpperCase(),
        militaryOrganizationId: data.militaryOrganizationId,
        militaryOrganization: {} as any // O store/service deve lidar com isso
      }

      await store.updateSection(sectionData)

      // Feedback de sucesso
      const successMessage = getTranslatedMessage(
        'success.sectionUpdated',
        'Seção atualizada com sucesso!'
      )
      toast.success(successMessage)

    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao atualizar seção'
      )
      toast.error(appError.message)
      throw appError
    }
  }

  /**
   * Remove uma seção
   */
  const deleteSection = async (sectionId: string): Promise<void> => {
    if (!sectionId) {
      const appError = createSectionError(
        'errors.invalidId',
        'ID da seção é obrigatório',
        400
      )
      toast.error(appError.message)
      throw appError
    }

    try {
      await store.deleteSection(sectionId)

      // Feedback de sucesso
      const successMessage = getTranslatedMessage(
        'success.sectionDeleted',
        'Seção excluída com sucesso!'
      )
      toast.success(successMessage)

    } catch (error) {
      const appError = createSectionError(
        'errors.serverCommunication',
        'Erro ao excluir seção'
      )
      toast.error(appError.message)
      throw appError
    }
  }

  /**
   * Busca uma seção específica por ID
   */
  const findSection = async (sectionId: string): Promise<section | null> => {
    if (!sectionId) {
      const appError = createSectionError(
        'errors.invalidId',
        'ID da seção é obrigatório',
        400
      )
      throw appError
    }

    try {
      await store.findSection(sectionId)
      return selectedSection.value
    } catch (error) {
      const appError = createSectionError(
        'errors.recordNotFound',
        'Seção não encontrada'
      )
      console.error('Find section error:', appError.message)
      throw appError
    }
  }

  // =====================================
  // OPERAÇÕES DE SELEÇÃO
  // =====================================

  /**
   * Define a seção selecionada
   */
  const selectSection = (section: section | null): void => {
    if (section) {
      store.setSelectedSection(section)
    } else {
      store.clearSelectedSection()
    }
  }

  /**
   * Limpa a seção selecionada
   */
  const clearSelection = (): void => {
    store.clearSelectedSection()
  }

  // =====================================
  // UTILITÁRIOS
  // =====================================

  /**
   * Filtra seções com base em critérios
   */
  const filterSections = (filters: SectionFilters) => {
    return computed(() => {
      let filtered = sections.value

      if (filters.militaryOrganizationId) {
        filtered = filtered.filter(
          section => section.militaryOrganizationId === filters.militaryOrganizationId
        )
      }

      if (filters.search?.trim()) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          section => 
            section.name.toLowerCase().includes(searchTerm) ||
            section.acronym.toLowerCase().includes(searchTerm)
        )
      }

      return filtered
    })
  }

  /**
   * Verifica se uma sigla já existe para uma determinada OM
   */
  const isAcronymTaken = (acronym: string, militaryOrganizationId: string, excludeId?: string): boolean => {
    return sections.value.some(
      section => 
        section.id !== excludeId &&
        section.acronym.toLowerCase() === acronym.toLowerCase() &&
        section.militaryOrganizationId === militaryOrganizationId
    )
  }

  /**
   * Retorna estatísticas das seções
   */
  const getSectionStats = () => {
    return computed(() => ({
      total: sections.value.length,
      byOrganization: sections.value.reduce((acc, section) => {
        const omId = section.militaryOrganizationId
        acc[omId] = (acc[omId] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }))
  }

  // =====================================
  // INTERFACE PÚBLICA
  // =====================================

  return {
    // Estado reativo
    sections: readonly(sections),
    selectedSection: readonly(selectedSection),
    loading: readonly(loading),
    error: readonly(error),
    totalSections: readonly(totalSections),
    
    // Computeds utilitários
    sectionsByOM,
    
    // Operações CRUD
    fetchSections,
    fetchSectionsByOM,
    createSection,
    updateSection,
    deleteSection,
    findSection,
    
    // Gerenciamento de seleção
    selectSection,
    clearSelection,
    
    // Utilitários
    filterSections,
    isAcronymTaken,
    getSectionStats
  }
}