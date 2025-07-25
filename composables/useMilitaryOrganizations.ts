import type { militaryOrganization } from '~/types/military-organization'
import { useMilitaryOrganizationStore } from '~/stores/military-organization.store'
import { createAppError, type ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { toast } from 'vue3-toastify'
import { militaryOrganizationService } from '~/services/militaryOrganization.service'

interface MilitaryOrganizationFilters {
  search?: string
  parentId?: string | null
}

// noinspection JSUnusedGlobalSymbols
export const useMilitaryOrganizations = () => {
  const store = useMilitaryOrganizationStore()
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

  const createMilitaryOrganizationError = (messageKey: string, fallbackMessage: string, statusCode = 500) => {
    return createAppError(messageKey, {
      statusCode,
      statusMessageKey: 'errors.genericTitle',
      fallbackStatusMessage: 'Military Organization Error',
      fallbackMessage,
    } satisfies ErrorHandlerOptions)
  }

  // accessors
  const militaryOrganizations = computed(() => store.militaryOrganizations)
  const selectedMilitaryOrganization = computed(() => store.selectedMilitaryOrganization)
  const totalMilitaryOrganizations = computed(() => store.totalMilitaryOrganizations)
  const rootMilitaryOrganizations = computed(() =>
    militaryOrganizations.value.filter(org => !org.militaryOrganizationId),
  )
  const subordinateMilitaryOrganizations = computed(() => (parentId: string) =>
    militaryOrganizations.value.filter(org => org.militaryOrganizationId === parentId),
  )

  const fetchMilitaryOrganizations = async (): Promise<militaryOrganization[]> => {

    loading.value = true
    error.value = ''

    try {
      const response = await militaryOrganizationService.findAll()

      if (response.success) {
        store.setMilitaryOrganizations(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Erro ao carregar organizações militares')
      }
    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.serverCommunication',
        'Erro ao carregar organizações militares',
      )
      console.error('Fetch military organizations error:', appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const createMilitaryOrganization = async (data: militaryOrganization): Promise<void> => {

    if (!data.name?.trim() || !data.acronym?.trim()) {
      const appError = createMilitaryOrganizationError(
        'errors.allFieldsRequired',
        'Nome e sigla são obrigatórios',
        400,
      )
      toast.error(appError.message)
      throw appError
    }

    const existingOrganization = militaryOrganizations.value.find(
      org => org.acronym.toLowerCase() === data.acronym.toLowerCase(),
    )

    if (existingOrganization) {
      const appError = createMilitaryOrganizationError(
        'errors.duplicateEntry',
        'Já existe uma organização militar com esta sigla',
        409,
      )
      toast.error(appError.message)
      throw appError
    }

    loading.value = true
    error.value = ''

    try {
      const organizationData: militaryOrganization = {
        name: data.name.trim() as string,
        acronym: data.acronym.trim().toUpperCase() as string,
        color: data.color || '#1976d2',
        logo: data.logo || '/logos/default/default.png',
        militaryOrganizationId: data.militaryOrganizationId || null,
      }

      const response = await militaryOrganizationService.create(
        organizationData,
      )

      if (response.success) {
        store.militaryOrganizations.push(response.data)
        const successMessage = getTranslatedMessage(
          'success.militaryOrganizationCreated',
          'Organização militar criada com sucesso!',
        )
        toast.success(successMessage)
      }
    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.serverCommunication',
        'Erro ao criar organização militar',
      )
      toast.error(appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const updateMilitaryOrganization = async (data: militaryOrganization): Promise<void> => {
    if (!data.id || !data.name?.trim() || !data.acronym?.trim()) {
      const appError = createMilitaryOrganizationError(
        'errors.allFieldsRequired',
        'ID, nome e sigla são obrigatórios',
        400,
      )
      toast.error(appError.message)
      throw appError
    }

    const existingOrganization = militaryOrganizations.value.find(
      mo => mo.id !== data.id && mo.acronym.toLowerCase() === data.acronym.toLowerCase(),
    )

    if (existingOrganization) {
      const appError = createMilitaryOrganizationError(
        'errors.duplicateEntry',
        'Já existe uma organização militar com esta sigla',
        409,
      )
      toast.error(appError.message)
      throw appError
    }

    loading.value = true
    error.value = ''

    try {
      const response = await militaryOrganizationService.update(data)

      if (response.success) {
        store.updateMilitaryOrganization(response.data)
      }

    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.serverCommunication',
        'Erro ao atualizar organização militar',
      )
      toast.error(appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const deleteMilitaryOrganization = async (id: string): Promise<void> => {
    if (!id) {
      const appError = createMilitaryOrganizationError(
        'errors.invalidId',
        'ID da organização militar é obrigatório',
        400,
      )
      toast.error(appError.message)
      throw appError
    }

    loading.value = true
    error.value = ''
    try {
      const response = await militaryOrganizationService.delete(id)

      if (response.success) {
        const successMessage = getTranslatedMessage(
          'success.militaryOrganizationDeleted',
          'Organização militar excluída com sucesso!',
        )
        toast.success(successMessage)
        store.clearDeletedMilitaryOrganization(id)
      }
      // todo tratar o erro em falha

    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.serverCommunication',
        'Erro ao excluir organização militar',
      )
      toast.error(appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const deleteMilitaryOrganizationLogo = async (militaryOrganizationId: string): Promise<void> => {
    if (!militaryOrganizationId) {
      const appError = createMilitaryOrganizationError(
        'errors.invalidId',
        'ID da organização militar é obrigatório',
        400,
      )
      toast.error(appError.message)
      throw appError
    }

    loading.value = true
    error.value = ''
    try {
      const response = await militaryOrganizationService.deleteLogo(militaryOrganizationId)

      if (response.success) {

        store.deleteMilitaryOrganizationLogo(response.data)

        const successMessage = getTranslatedMessage(
          'success.militaryOrganizationLogoDeleted',
          'Logo da organização militar removido com sucesso!',
        )
        toast.success(successMessage)
      }
    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.serverCommunication',
        'Erro ao remover logo da organização militar',
      )
      toast.error(appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const findMilitaryOrganization = async (id: string): Promise<militaryOrganization | null> => {
    if (!id) {
      throw createMilitaryOrganizationError(
        'errors.invalidId',
        'ID da organização militar é obrigatório',
        400,
      )
    }

    loading.value = true
    error.value = ''
    try {
      const response = await militaryOrganizationService.findById(id)

      if (response.success && response.data) {
        store.setSelectedMilitaryOrganization(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Organização militar não encontrada')
      }

    } catch (error) {
      const appError = createMilitaryOrganizationError(
        'errors.recordNotFound',
        'Organização militar não encontrada',
      )
      console.error('Find military organization error:', appError.message)
      throw appError
    } finally {
      loading.value = false
    }
  }

  const selectMilitaryOrganization = (militaryOrganization: militaryOrganization | null): void => {
    if (militaryOrganization) {
      store.setSelectedMilitaryOrganization(militaryOrganization)
    } else {
      store.clearSelectedMilitaryOrganization()
    }
  }

  const clearSelection = (): void => {
    store.clearSelectedMilitaryOrganization()
  }

  const clearState = (): void => {
    store.clearMilitaryOrganizationState()
  }

  const filterMilitaryOrganizations = (filters: MilitaryOrganizationFilters) => {
    return computed(() => {
      let filtered = militaryOrganizations.value

      if (filters.parentId !== undefined) {
        filtered = filtered.filter(
          mo => mo.militaryOrganizationId === filters.parentId,
        )
      }

      if (filters.search?.trim()) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          mo =>
            mo.name.toLowerCase().includes(searchTerm) ||
            mo.acronym.toLowerCase().includes(searchTerm),
        )
      }

      return filtered
    })
  }

  const isAcronymTaken = (acronym: string, excludeId?: string): boolean => {
    return militaryOrganizations.value.some(
      mo =>
        mo.id !== excludeId &&
        mo.acronym.toLowerCase() === acronym.toLowerCase(),
    )
  }

  const getMilitaryOrganizationStats = () => {
    return computed(() => ({
      total: militaryOrganizations.value.length,
      root: rootMilitaryOrganizations.value.length,
      subordinate: militaryOrganizations.value.length - rootMilitaryOrganizations.value.length,
    }))
  }

  const getMilitaryOrganizationById = (id: string): militaryOrganization | undefined => {
    return militaryOrganizations.value.find(org => org.id === id)
  }

  const getMilitaryOrganizationAcronym = (id: string): string => {
    const militaryOrganization = militaryOrganizations.value.find(org => org.id === id)
    return militaryOrganization?.acronym || ''
  }

  return {
    militaryOrganizations: readonly(militaryOrganizations),
    selectedMilitaryOrganization: readonly(selectedMilitaryOrganization),
    loading: readonly(loading),
    error: readonly(error),
    totalMilitaryOrganizations: readonly(totalMilitaryOrganizations),

    rootMilitaryOrganizations,
    subordinateMilitaryOrganizations,

    fetchMilitaryOrganizations,
    createMilitaryOrganization,
    updateMilitaryOrganization,
    deleteMilitaryOrganization,
    deleteMilitaryOrganizationLogo,
    findMilitaryOrganization,

    selectMilitaryOrganization,
    clearSelection,
    clearState,

    filterMilitaryOrganizations,
    isAcronymTaken,
    getMilitaryOrganizationStats,
    getMilitaryOrganizationById,
    getMilitaryOrganizationAcronym,
  }
}

