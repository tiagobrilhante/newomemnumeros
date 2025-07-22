import type { rank } from '~/types/rank'

export type militaryOrganization = {
  id: string
  name: string
  acronym: string
  color: string
  logo: string
  militaryOrganizationId: string | null
}

export type section = {
  id: string
  name: string
  acronym: string
  militaryOrganizationId: string
  militaryOrganization: militaryOrganization
}

export type role = {
  id: string
  name: string
  acronym: string
  sectionId: string
  section: section
  permissions: string[] // Array de strings das permissões
}

export type user = {
  id: string
  name: string
  serviceName: string
  email: string
  cpf: string
  rank: rank
  role?: role | null
}

export type userWithoutPassword = user

export type userState = {
  users: userWithoutPassword[]
  selectedUser: userWithoutPassword | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
