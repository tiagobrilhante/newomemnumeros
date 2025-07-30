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
