import type { rank } from '~/types/rank'
import type { section } from '~/types/sections'

export type role = {
  id: string
  name: string
  acronym: string
  sectionId: string
  section: section
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

export type userState = {
  users: userWithoutPassword[]
  selectedUser: userWithoutPassword | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
