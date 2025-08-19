export type registerData = {
  name: string,
  serviceName: string,
  rankId: string
  cpf: string,
  email: string,
  password: string,
}

export type RegisterResponse = {
  success: true,
  statusCode: number,
  message: string,
}
