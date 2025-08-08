import type { militaryOrganization, MilitaryOrganizationMutable } from './military-organization'

export type Permission = {
  readonly id?: string
  readonly slug: string
  readonly description?: string | null
  readonly category?: string | null
}

export type RolePermission = {
  readonly id?: string
  readonly permissionId: string
  readonly roleId: string
  readonly permission: Permission
}

export type Role = {
  readonly id?: string
  readonly name: string
  readonly acronym: string
  readonly militaryOrganizations?: militaryOrganization[]
  readonly permissions?: RolePermission[]
  readonly deleted?: boolean
  readonly createdAt?: string
  readonly updatedAt?: string
}

// Versão mutável para uso em stores
export type RoleMutable = {
  id?: string
  name: string
  acronym: string
  militaryOrganizations?: MilitaryOrganizationMutable[]
  permissions?: RolePermission[]
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
}

// Tipos para input de criação/atualização (frontend)
export type RoleCreateInput = {
  name: string
  acronym: string
  militaryOrganizationIds?: string[]
  sectionIds?: string[]
  permissionIds?: string[]
}

export type RoleUpdateInput = {
  name?: string
  acronym?: string
  militaryOrganizationIds?: string[]
  sectionIds?: string[]
  permissionIds?: string[]
}
