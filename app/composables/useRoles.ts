import { toast } from 'vue3-toastify'
import { useRoleStore } from '~/stores/role.store'
import { createAppError, type ErrorHandlerOptions } from '~/utils/clientErrorHandler'
import { roleService } from '~/services/role.service'
import type { Role } from '#shared/types/role'

interface RoleFilters {
  search?: string
  militaryOrganizationId?: string | null
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
  const globalRoles = computed(() =>
    roles.value.filter(role => !role.militaryOrganizationId),
  )
  const organizationRoles = computed(() => (organizationId: string) =>
    roles.value.filter(role => role.militaryOrganizationId === organizationId),
  )

  const fetchRoles = async (): Promise<Role[]> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.getAll()
      
      if (response.success && response.data) {
        store.setRoles(response.data)
        return response.data
      } else {
        const errorMessage = 'Failed to fetch roles'
        error.value = errorMessage
        throw createRoleError('errors.fetchRoles', errorMessage)
      }
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
      
      if (response.success && response.data) {
        store.setRolesByOrganization(organizationId, response.data)
        return response.data
      } else {
        const errorMessage = 'Failed to fetch organization roles'
        error.value = errorMessage
        throw createRoleError('errors.fetchOrganizationRoles', errorMessage)
      }
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
      
      if (response.success && response.data) {
        store.setSelectedRole(response.data)
        return response.data
      } else {
        const errorMessage = 'Role not found'
        error.value = errorMessage
        throw createRoleError('errors.roleNotFound', errorMessage, 404)
      }
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.roleNotFound', 'Role not found')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRole = async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.create(roleData as Role)
      
      if (response.success && response.data) {
        store.addRole(response.data)
        const successMessage = getTranslatedMessage('success.roleCreated', 'Role created successfully')
        toast.success(successMessage)
        return response.data
      } else {
        const errorMessage = 'Failed to create role'
        error.value = errorMessage
        throw createRoleError('errors.createRole', errorMessage)
      }
    } catch (err) {
      const errorMessage = getTranslatedMessage('errors.createRole', 'Failed to create role')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (roleData: Role): Promise<Role> => {
    loading.value = true
    error.value = ''

    try {
      const response = await roleService.update(roleData)
      
      if (response.success && response.data) {
        store.updateRole(response.data)
        const successMessage = getTranslatedMessage('success.roleUpdated', 'Role updated successfully')
        toast.success(successMessage)
        return response.data
      } else {
        const errorMessage = 'Failed to update role'
        error.value = errorMessage
        throw createRoleError('errors.updateRole', errorMessage)
      }
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
      
      if (response.success) {
        store.removeRole(id)
        const successMessage = getTranslatedMessage('success.roleDeleted', 'Role deleted successfully')
        toast.success(successMessage)
      } else {
        const errorMessage = 'Failed to delete role'
        error.value = errorMessage
        throw createRoleError('errors.deleteRole', errorMessage)
      }
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

      if (filters.militaryOrganizationId !== undefined) {
        if (filters.militaryOrganizationId === null) {
          // Buscar roles globais
          filtered = filtered.filter(role => !role.militaryOrganizationId)
        } else {
          // Buscar roles de uma organização específica
          filtered = filtered.filter(role => role.militaryOrganizationId === filters.militaryOrganizationId)
        }
      }

      return filtered
    }
  })

  const clearSelectedRole = () => {
    store.clearSelectedRole()
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
    filteredRoles,

    // Ações
    fetchRoles,
    fetchRolesByOrganization,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    clearSelectedRole,
    clearError,
  }
}
