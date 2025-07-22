export interface AuthRouteMeta {
  unauthenticatedOnly?: boolean
  navigateAuthenticatedTo?: string
}

export type RouteAuthMeta = boolean | AuthRouteMeta

export type  loginCredentials = {
  email: string
  password: string
}

export type registerData = {
  name: string,
  serviceName: string,
  cpf: string,
  email: string,
  password: string,
}
