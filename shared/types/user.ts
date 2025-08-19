import type { rank } from './rank'
import type { section } from './sections'
import type { militaryOrganization } from './military-organization'

export type role = {
  id: string
  name: string
  acronym: string
  militaryOrganizations?: militaryOrganization[]
  permissions: string[]
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

export type UserWithRank = {
  id: string
  name: string
  serviceName: string
  email: string
  cpf: string
  rankId: string
  roleId?: string | null
  sectionId?: string | null
  deleted: boolean
  createdAt: Date | string
  updatedAt: Date | string
  rank: rank
}

export type userState = {
  users: userWithoutPassword[]
  selectedUser: userWithoutPassword | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
