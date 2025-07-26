export type militaryOrganization = {
  id?: string
  name: string
  acronym: string
  color?: string
  logo?: string
  militaryOrganizationId?: string | null
  militaryOrganizations?: militaryOrganization[]
  parentOrganization?: militaryOrganization
  subOrganizationsCount?: number
  usersCount?: number
}
