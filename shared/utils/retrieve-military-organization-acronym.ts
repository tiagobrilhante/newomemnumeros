import type { militaryOrganization } from '~/types/core/organization'

export const retrieveMilitaryOrganizationAcronym = (
  id: number,
  militaryOrganizations: militaryOrganization[]
) => {
  const militaryOrganization = militaryOrganizations.find(
    (militaryOrganization) => militaryOrganization.id === id
  )
  return militaryOrganization?.acronym
}
