import type { militaryOrganization } from '~/types/military-organization'


export type section = {
  id?: string
  name: string
  acronym: string
  militaryOrganizationId: string
  militaryOrganization: militaryOrganization
}
