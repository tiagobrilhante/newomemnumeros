import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import prisma from '../../prisma'
import { getTokenFromRequest, clearAuthCookie } from '../../utils/cookieAuth'
import { UserTransformer } from '../../transformers/user.transformer'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    const token = getTokenFromRequest(event)

    if (!token) {
      clearAuthCookie(event)
      return await handleError('errors.tokenNotProvided', locale)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui') as JwtPayload
    const userId = decoded.userId

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
      return await handleError('errors.userNotFound', locale)
    }

    const transformedUser = UserTransformer.transformForAuth(user)

    return {
      user: transformedUser,
    }
  } catch (error) {
    clearAuthCookie(event)
    throw await handleError(error, locale)
  }
})
