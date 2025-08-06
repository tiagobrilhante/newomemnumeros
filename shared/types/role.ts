import type { militaryOrganization, MilitaryOrganizationMutable } from '#shared/types/military-organization'

export type Role = {
  readonly id?: string
  readonly name: string
  readonly acronym: string
  readonly militaryOrganizationId?: string | null
  readonly militaryOrganization?: militaryOrganization
  readonly deleted?: boolean
  readonly createdAt?: string
  readonly updatedAt?: string
}

// Versão mutável para uso em stores
export type RoleMutable = {
  id?: string
  name: string
  acronym: string
  militaryOrganizationId?: string | null
  militaryOrganization?: MilitaryOrganizationMutable
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
}
