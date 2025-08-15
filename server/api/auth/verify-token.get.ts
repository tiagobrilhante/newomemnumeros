import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { defineEventHandler, createError } from 'h3'
import prisma from '../../prisma'
import { getTokenFromRequest, clearAuthCookie } from '../../utils/cookieAuth'
import { UserTransformer } from '../../transformers/user.transformer'
import { handleError, createAuthError } from '../../utils/errorHandler'
import { createSuccessResponse } from '../../utils/responseWrapper'
import { getLocale } from '../../utils/i18n'
import type { ApiResponse } from '#shared/types/api-response'
import { ErrorCode } from '#shared/types/api-response'

interface VerifyTokenResponse {
  user: any
}

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event): Promise<ApiResponse<VerifyTokenResponse>> => {
  const locale = getLocale(event)

  try {
    const token = getTokenFromRequest(event)

    if (!token) {
      clearAuthCookie(event)
      const errorResponse = await createAuthError(locale, ErrorCode.UNAUTHORIZED)
      throw createError({
        statusCode: errorResponse.error.statusCode,
        statusMessage: errorResponse.error.message,
        data: errorResponse
      })
    }

    let decoded: JwtPayload
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui') as JwtPayload
    } catch (jwtError) {
      clearAuthCookie(event)
      const errorResponse = await createAuthError(locale, ErrorCode.TOKEN_EXPIRED)
      throw createError({
        statusCode: errorResponse.error.statusCode,
        statusMessage: errorResponse.error.message,
        data: errorResponse
      })
    }

    const userId = decoded.userId

    const user = await prisma.user.findUnique({
      where: { id: userId, deleted: false },
      include: {
        rank: true,
        role: {
          include: {
            roleMilitaryOrganization: {
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
        section: {
          include: {
            militaryOrganization: true
          }
        },
      },
    })

    if (!user) {
      clearAuthCookie(event)
      const errorResponse = await createAuthError(locale, ErrorCode.UNAUTHORIZED)
      throw createError({
        statusCode: errorResponse.error.statusCode,
        statusMessage: errorResponse.error.message,
        data: errorResponse
      })
    }

    const transformedUser = UserTransformer.transformForAuth(user)

    return createSuccessResponse({ user: transformedUser })
  } catch (error) {
    clearAuthCookie(event)
    
    // Se já é um erro do Nuxt/H3, propaga
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    const errorResponse = await handleError(error, locale, 'VERIFY_TOKEN')
    throw createError({
      statusCode: errorResponse.error.statusCode,
      statusMessage: errorResponse.error.message,
      data: errorResponse
    })
  }
})
