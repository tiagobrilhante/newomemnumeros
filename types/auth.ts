export interface AuthRouteMeta {
  unauthenticatedOnly?: boolean
  navigateAuthenticatedTo?: string
}

// Ou pode ser um boolean simples para rotas protegidas
export type RouteAuthMeta = boolean | AuthRouteMeta

//registerData

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
