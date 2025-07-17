import { defineStore } from 'pinia'
import { userService } from '~/services/userService'
import type { userWithoutPassword, userState } from '~/types/core/user'

export const useAdminUserStore = defineStore('userStore', {
  state: (): userState => ({
    users: [],
    selectedUser: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await userService.getAllUsers()
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar usuários'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId: string) {
      this.loading = true
      this.error = null
      try {
        await userService.deleteUser(userId)
        this.users = this.users.filter((user) => user.id !== userId)
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao excluir usuário'
        }
      } finally {
        this.loading = false
      }
    },

    async findUser(userId: string): Promise<userWithoutPassword | null> {
      this.loading = true
      this.error = null
      try {
        const user = await userService.findUserById(userId)
        this.selectedUser = user
        return user
      } catch (err: unknown) {
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Erro desconhecido ao buscar Usuário'
        }
        return null // Retornamos null em caso de erro
      } finally {
        this.loading = false
      }
    },

    async findUserByServiceName(serviceName: string): Promise<userWithoutPassword[]> {
      const { currentUser } = useUserData()

      this.loading = true
      this.error = null

      if (
        currentUser.value.role
      ) {
        this.error = 'você não tem permissão para pesquisar usuários'
        this.loading = false
        return []
      } else {
        if (currentUser.value.role) {
          try {
            const hasCreateUserLinkPermission = currentUser.value.role.some(
              (setupUser) =>
                setupUser.permissionSetup.permissions.some(
                  (permission) => permission.permission === 'create_user_link'
                )
            )

            const hasSuperAdminPermission = currentUser.value.permissionSetupUser.some(
              (setupUser) =>
                setupUser.permissionSetup.permissions.some(
                  (permission) => permission.permission === 'super_admin'
                )
            )

            if (hasSuperAdminPermission) {
              return await userService.findUserByServiceNameAll(serviceName)
            } else if (hasCreateUserLinkPermission) {
              const serviceNameWithOrgId = `${serviceName}-${currentUser.value.militaryOrganizationId}`
              return await userService.findUserByServiceName(serviceNameWithOrgId)
            } else {
              const serviceNameWithOrgId = `${serviceName}-${currentUser.value.militaryOrganizationId}`
              return await userService.findUserByServiceName(serviceNameWithOrgId)
            }
          } catch (err: unknown) {
            if (typeof err === 'string') {
              this.error = err
            } else if (err instanceof Error) {
              this.error = err.message
            } else {
              this.error = 'Erro desconhecido ao buscar Usuários'
            }
            return []
          } finally {
            this.loading = false
          }
        } else {
          this.loading = false
          return []
        }
      }
    },
  },

  getters: {
    totalUsers: (state) => state.users.length,
  },
})
