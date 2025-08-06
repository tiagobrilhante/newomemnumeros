import type { SectionMutable } from './sections'

export type militaryOrganization = {
  readonly id?: string
  readonly name: string
  readonly acronym: string
  readonly color?: string
  readonly logo?: string
  readonly sections?: readonly section[]
  readonly militaryOrganizationId?: string | null
  readonly parentOrganization?: militaryOrganization
  readonly militaryOrganizations?: readonly militaryOrganization[]

  readonly subOrganizationsCount?: number
  readonly usersCount?: number
}

// Versão mutável para uso em stores
export type MilitaryOrganizationMutable = {
  id?: string
  name: string
  acronym: string
  color?: string
  logo?: string
  sections?: SectionMutable[]
  militaryOrganizationId?: string | null
  parentOrganization?: MilitaryOrganizationMutable
  militaryOrganizations?: MilitaryOrganizationMutable[]
  subOrganizationsCount?: number
  usersCount?: number
}
