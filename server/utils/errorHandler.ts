import { Prisma } from '@prisma/client'
import { createError } from 'h3'

export function handleError(error: unknown): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return createError({
      statusCode: 400,
      message: `Erro relacionado ao banco de dados: ${error.message}`,
      data: {
        code: error.code,
        meta: error.meta || {},
      },
    })
  }

  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      message: `Erro interno: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }

  return createError({
    statusCode: 500,
    message: 'Erro desconhecido',
  })
}
