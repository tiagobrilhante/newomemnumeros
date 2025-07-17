import type { H3Event } from 'h3'

// noinspection JSUnusedGlobalSymbols
export default async (event: H3Event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Usuário não autenticado',
    })
  }

  try {
    const hasAccess = await $fetch('/api/user/hasAccess', {
      headers: {
        cookie: getHeader(event, 'cookie') || '',
        authorization: getHeader(event, 'authorization') || '',
      },
    })

    if (!hasAccess) {
      return createError({
        statusCode: 403,
        message: 'Acesso negado',
      })
    }
  } catch (error) {
    console.error('[protectRoute] Erro na verificação de acesso:', error)
    throw createError({
      statusCode: 401,
      message: 'Erro na verificação de acesso',
    })
  }
}
