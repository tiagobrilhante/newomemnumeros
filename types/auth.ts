export interface AuthRouteMeta {
  unauthenticatedOnly?: boolean
  navigateAuthenticatedTo?: string
}

// Ou pode ser um boolean simples para rotas protegidas
export type RouteAuthMeta = boolean | AuthRouteMeta
