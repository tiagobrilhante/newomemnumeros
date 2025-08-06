import type { MilitaryOrganizationMutable } from './military-organization'

export type section = {
  id?: string
  name: string
  acronym: string
  militaryOrganizationId: string
  militaryOrganization?: militaryOrganization
}

// Versão mutável para uso em stores  
export type SectionMutable = {
  id?: string
  name: string
  acronym: string
  militaryOrganizationId: string
  militaryOrganization?: MilitaryOrganizationMutable
}
