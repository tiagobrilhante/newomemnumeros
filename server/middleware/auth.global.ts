import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import prisma from '../prisma'

interface CustomJwtPayload extends JwtPayload {
  userId: string
}

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event: H3Event) => {
  if (event.path.startsWith('/api/auth/') || event.path === '/api/auth') {
    return
  }

  if (!event.path.startsWith('/api/')) {
    return
  }

  try {
    const authHeader = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'auth-token') // Usar o nome correto do cookie

    let token = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }

    if (!token) {
      return
    }

    if (typeof token !== 'string' || token.trim() === '') {
      return
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret'
      ) as CustomJwtPayload

      if (!decoded) {
        return
      }

      const userRecord = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          rank: true,
        },
      })

      if (!userRecord) {
        return
      }

      const userProcessed = JSON.parse(
        JSON.stringify(userRecord, (_key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      )

      const userWithoutPassword = { ...userProcessed }
      if ('password' in userWithoutPassword) {
        delete userWithoutPassword.password
      }

      event.context.user = userWithoutPassword
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.log(`[AUTH] JWT verification error: ${error.message}`)
      } else {
        console.error('[AUTH] Token verification error:', error)
      }
    }
  } catch (error) {
    console.error('[AUTH] Middleware error:', error)
  }
})
