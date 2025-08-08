import { toast } from 'vue3-toastify'
import { useRoleStore } from '~/stores/role.store'
import { useNetworkErrorHandler } from './useErrorHandler'
import { createAppError, type ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { roleService } from '~/services/role.service'
import type { Role, RoleCreateInput, RoleUpdateInput } from '#shared/types/role'

interface RoleFilters {
  search?: string
  militaryOrganizationIds?: string[]
}

// noinspection JSUnusedGlobalSymbols
export const useRoles = () => {
  const store = useRoleStore()
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

  const createRoleError = (messageKey: string, fallbackMessage: string, statusCode = 500) => {
    return createAppError(messageKey, {
      statusCode,
      statusMessageKey: 'errors.genericTitle',
      fallbackStatusMessage: 'Role Error',
      fallbackMessage,
    } satisfies ErrorHandlerOptions)
  }


  // Accessors
  const roles = computed(() => store.roles)
  const selectedRole = computed(() => store.selectedRole)
  const totalRoles = computed(() => store.totalRoles)
  // Roles globais = sem vinculação organizacional específica (templates)
  const globalRoles = computed(() =>
    roles.value.filter(role => !role.militaryOrganizations?.length),
  )

  // Roles organizacionais = vinculadas a organizações específicas
  const organizationRoles = computed(() => (organizationId: string) =>
    roles.value.filter(role =>
      role.militaryOrganizations?.some(mo => mo.id === organizationId)
    ),
  )

  // Todas as roles organizacionais (não globais)
  const nonGlobalRoles = computed(() =>
    roles.value.filter(role => role.militaryOrganizations?.length),
  )

  const fetchRoles = async (): Promise<Role[]> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.getAll()
      
      if (!response.success) {
        throw createRoleError(
          'errors.serverCommunication',
          'Erro ao carregar roles',
          500,
        )
      }
      
      store.setRoles(response.data)
      return response.data
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.fetchRoles', 'Failed to fetch roles')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRolesByOrganization = async (organizationId: string): Promise<Role[]> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.findByOrganization(organizationId)
      
      if (!response.success) {
        throw createRoleError(
          'errors.serverCommunication',
          'Erro ao carregar roles da organização',
          500,
        )
      }
      
      store.setRolesByOrganization(organizationId, response.data)
      return response.data
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.fetchOrganizationRoles', 'Failed to fetch organization roles')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRoleById = async (id: string): Promise<Role | null> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.findById(id)
      
      if (!response.success) {
        throw createRoleError(
          'errors.recordNotFound',
          'Role não encontrada',
          404,
        )
      }
      
      store.setSelectedRole(response.data)
      return response.data
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.roleNotFound', 'Role not found')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRole = async (roleData: RoleCreateInput): Promise<Role> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.create(roleData)
      
      if (!response.success) {
        throw createRoleError(
          'errors.serverCommunication',
          'Erro ao criar role',
          500,
        )
      }
      
      store.addRole(response.data)
      const successMessage = getTranslatedMessage('success.roleCreated', 'Role created successfully')
      toast.success(successMessage)
      return response.data
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.createRole', 'Failed to create role')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (id: string, roleData: RoleUpdateInput): Promise<Role> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.update(id, roleData)
      
      if (!response.success) {
        throw createRoleError(
          'errors.serverCommunication',
          'Erro ao atualizar role',
          500,
        )
      }
      
      store.updateRole(response.data)
      const successMessage = getTranslatedMessage('success.roleUpdated', 'Role updated successfully')
      toast.success(successMessage)
      return response.data
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.updateRole', 'Failed to update role')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (id: string): Promise<void> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.delete(id)
      
      if (!response.success) {
        throw createRoleError(
          'errors.serverCommunication',
          'Erro ao excluir role',
          500,
        )
      }
      
      store.removeRole(id)
      const successMessage = getTranslatedMessage('success.roleDeleted', 'Role deleted successfully')
      toast.success(successMessage)
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.deleteRole', 'Failed to delete role')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const filteredRoles = computed(() => {
    return (filters: RoleFilters) => {
      let filtered = roles.value

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(role =>
          role.name.toLowerCase().includes(searchLower) ||
          role.acronym.toLowerCase().includes(searchLower)
        )
      }

      if (filters.militaryOrganizationIds) {
        // Buscar roles de organizações específicas
        filtered = filtered.filter(role =>
          filters.militaryOrganizationIds!.some(orgId =>
            role.militaryOrganizations?.some(mo => mo.id === orgId)
          )
        )
      }

      return filtered
    }
  })

  const clearSelectedRole = () => {
    store.clearSelectedRole()
  }

  const fetchRoleUsage = async (roleId: string) => {
    if (!roleId) {
      throw new Error('Role ID is required')
    }

    const { data, execute } = useNetworkErrorHandler(
      async () => {
        const response = await $fetch(`/api/roles/${roleId}/usage`)
        return response.data
      },
      3, // maxRetries
      1000 // retryDelay
    )

    const result = await execute()
    return result
  }

  const clearError = () => {
    error.value = ''
  }

  return {
    // Estado
    loading: readonly(loading),
    error: readonly(error),

    // Dados computados
    roles,
    selectedRole,
    totalRoles,
    globalRoles,
    organizationRoles,
    nonGlobalRoles,
    filteredRoles,

    // Ações
    fetchRoles,
    fetchRolesByOrganization,
    fetchRoleById,
    fetchRoleUsage,
    createRole,
    updateRole,
    deleteRole,
    clearSelectedRole,
    clearError,
  }
}
