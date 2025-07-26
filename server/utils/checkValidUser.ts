import type { H3Event } from 'h3'
import protectRoute from '../utils/protectRoute'

export async function checkValidUser(event: H3Event) {
  await protectRoute(event)

  const user = event.context.user

  // Verificar se o usuário tem autenticação.
  if (!user) {
    return createError({
      statusCode: 401,
      message: 'Usuário não autenticado',
    })
  }

  return user
}
