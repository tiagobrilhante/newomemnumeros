import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import prisma from '~/server/prisma'
import { getTokenFromRequest, clearAuthCookie } from '~/server/utils/cookieAuth'
import { UserTransformer } from '~/server/transformers/user.transformer'

// noinspection JSUnusedGlobalSymbols
/**
 * Handler de verificação do token JWT
 * Usa HttpOnly cookie para máxima segurança
 */
export default defineEventHandler(async (event) => {
  try {
    const token = getTokenFromRequest(event)

    if (!token) {
      clearAuthCookie(event)
      return createError({
        statusCode: 401,
        message: 'Token não fornecido',
      })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui') as JwtPayload
    const userId = decoded.userId

    // Buscar usuário com dados completos
    const user = await prisma.user.findUnique({
      where: { id: userId, deleted: false },
      include: {
        rank: true,
        role: {
          include: {
            section: {
              include: {
                militaryOrganization: true
              }
            },
            permissions: {
              include: {
                permission: true
              }
            },
          },
        },
      },
    })

    if (!user) {
      clearAuthCookie(event)
      return createError({
        statusCode: 401,
        message: 'Usuário não encontrado',
      })
    }

    // Usar transformer para retornar dados formatados
    const transformedUser = UserTransformer.transformForAuth(user)

    return {
      user: transformedUser,
    }
  } catch (error) {
    console.error('Erro na verificação do token:', error)
    clearAuthCookie(event)

    throw createError({
      statusCode: 401,
      message: 'Token inválido',
    })
  }
})
