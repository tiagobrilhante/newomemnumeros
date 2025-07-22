export interface AuthRouteMeta {
  unauthenticatedOnly?: boolean
  navigateAuthenticatedTo?: string
}

export type RouteAuthMeta = boolean | AuthRouteMeta

export type  loginCredentials = {
  email: string
  password: string
}
