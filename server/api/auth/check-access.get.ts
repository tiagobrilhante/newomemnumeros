import prisma from '~/server/prisma/index'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string // Garante que o tipo é string
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente')
}

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const cookieToken = getCookie(event, 'auth')
  
  let token = null
  
  // Preferir o token do Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else if (cookieToken) {
    // Se o cookieToken for um objeto JSON com uma propriedade token, extrair o token
    if (typeof cookieToken === 'string' && cookieToken.includes('"token":')) {
      try {
        const authObject = JSON.parse(cookieToken)
        if (authObject && authObject.token) {
          token = authObject.token
        }
      } catch (e) {
        console.error('Erro ao parsear cookie auth:', e)
        token = cookieToken // Se falhar o parse, usar o próprio cookie como token
      }
    } else {
      token = cookieToken
    }
  }

  if (!token) {
    return createError({
      statusCode: 401,
      statusMessage: 'Token não fornecido',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    if (!decoded || typeof decoded.userId !== 'number') {
      return createError({
        statusCode: 403,
        statusMessage: 'Token inválido',
      })
    }

    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, email: true, deleted: true }
    })

    if (!user || user.deleted) {
      return createError({
        statusCode: 403,
        statusMessage: 'Acesso negado',
      })
    }

    // TODO: implementar o sistema de controle de acesso
    return { hasAccess: true }
  } catch (err) {
    console.error('[API] Erro ao verificar acesso:', err)
    return createError({
      statusCode: 403,
      statusMessage: 'Token inválido ou expirado',
    })
  }
})
