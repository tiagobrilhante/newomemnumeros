import type { user } from '../core/user'

export interface authResponse {
  user: user
}

export interface loginCredentials {
  email: string
  password: string
}

export interface registerData {
  name: string
  serviceName: string
  cpf: string
  email: string
  rankId: string
  password: string
  roleId?: string
}