import { Prisma } from '@prisma/client'
import { createError } from 'h3'

export async function handleError(error: unknown, locale: string): Promise<Error> {
  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    return error as unknown as Error
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let message: string
    let statusCode: number

    // Prisma code
    switch (error.code) {
      case 'P2002':
        message = await serverTByLocale(locale, 'errors.duplicateEntry')
        statusCode = 409
        break
      case 'P2025':
        message = await serverTByLocale(locale, 'errors.recordNotFound')
        statusCode = 404
        break
      case 'P2003':
        message = await serverTByLocale(locale, 'errors.foreignKeyConstraint')
        statusCode = 400
        break
      default:
        message = await serverTByLocale(locale, 'errors.databaseError')
        statusCode = 400
    }

    return createError({
      statusCode,
      message,
      data: {
        code: error.code,
        meta: error.meta || {},
      },
    })
  }

  // JS Errors
  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      message: await serverTByLocale(locale, 'errors.internalServerError'),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }

  // Unknown
  return createError({
    statusCode: 500,
    message: await serverTByLocale(locale, 'errors.unknownError'),
  })
}
