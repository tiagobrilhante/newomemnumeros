import { defineStore } from 'pinia'
import type { Role, RoleMutable } from '#shared/types/role'

// Helper para converter readonly para mutable
const toMutable = (role: Role): RoleMutable => ({
  id: role.id,
  name: role.name,
  acronym: role.acronym,
  militaryOrganizations: role.militaryOrganizations?.map(mo => ({
    id: mo.id,
    name: mo.name,
    acronym: mo.acronym,
    color: mo.color,
    logo: mo.logo,
    militaryOrganizationId: mo.militaryOrganizationId,
  })),
  permissions: role.permissions,
  deleted: role.deleted,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt
})

type RoleState = {
  roles: RoleMutable[]
  selectedRoleType: string | null
  selectedRole: RoleMutable | null
  loading: boolean
  error: string | null
}

export const useRoleStore = defineStore('roleStore', {
  state: (): RoleState => ({
    roles: [],
    selectedRoleType: null,
    selectedRole: null,
    loading: false,
    error: null,
  }),

  actions: {
    setRoles(roles: Role[]) {
      // Converte readonly para mutable para uso interno do store
      this.roles = roles.map(toMutable)
    },

    addRole(role: Role) {
      const mutableRole = toMutable(role)
      this.roles.push(mutableRole)
    },

    updateRole(updatedRole: Role) {
      const roleIndex = this.roles.findIndex(
        (role: RoleMutable) => role.id === updatedRole.id,
      )
      if (roleIndex !== -1) {
        const updatedMutableRole = toMutable(updatedRole)
        this.roles.splice(roleIndex, 1, updatedMutableRole)

        // Atualiza tamb�m selectedRole se for o mesmo
        if (this.selectedRole?.id === updatedRole.id) {
          this.selectedRole = updatedMutableRole
        }
      }
    },

    removeRole(id: string) {
      this.roles = this.roles.filter(role => role.id !== id)

      // Limpa selectedRole se for o mesmo que est� sendo removido
      if (this.selectedRole?.id === id) {
        this.selectedRole = null
      }
    },

    setRoleType(type: string) {
      this.selectedRoleType = type
    },

    clearRoleType() {
      this.selectedRoleType = null
    },

    getRoleType() {
      return this.selectedRoleType
    },
    
    setSelectedRole(role: Role | null) {
      this.selectedRole = role ? toMutable(role) : null
    },

    clearSelectedRole() {
      this.selectedRole = null
    },

    setRolesByOrganization(organizationId: string, roles: Role[]) {
      // Remove roles existentes da organiza��o
      this.roles = this.roles.filter(role =>
        !role.militaryOrganizations?.some(mo => mo.id === organizationId)
      )

      // Adiciona os novos roles
      const newRoles = roles.map(toMutable)
      this.roles.push(...newRoles)
    },

    clearRolesByOrganization(organizationId: string) {
      this.roles = this.roles.filter(role =>
        !role.militaryOrganizations?.some(mo => mo.id === organizationId)
      )
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    clearRoleState() {
      this.roles = []
      this.selectedRole = null
      this.loading = false
      this.error = null
    },

    // Helper para buscar role por ID (com cache local)
    findRoleById(id: string): RoleMutable | null {
      return this.roles.find(role => role.id === id) || null
    },

    // Helper para verificar se um role existe
    hasRole(id: string): boolean {
      return this.roles.some(role => role.id === id)
    },
  },

  getters: {
    totalRoles: (state) => state.roles.length,
  },
})
