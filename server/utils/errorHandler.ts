import { Prisma } from '@prisma/client'
import { ErrorCode } from '#shared/types/api-response'
import type { ErrorResponse } from '#shared/types/api-response'
import { 
  createErrorResponse, 
  mapPrismaErrorCode, 
  mapHttpStatusToErrorCode 
} from './responseWrapper'
import { serverTByLocale } from './i18n'

/**
 * Handler principal de erros - retorna ApiResponse padronizada
 */
export async function handleError(
  error: unknown, 
  locale: string,
  context?: string
): Promise<ErrorResponse> {
  // Log do erro para debugging
  if (context) {
    console.error(`Error in ${context}:`, error)
  }

  // Se já é uma ErrorResponse, retorna como está
  if (error && typeof error === 'object' && 'success' in error && (error as any).success === false) {
    return error as ErrorResponse
  }

  // Erro de string com chave de i18n
  if (typeof error === 'string' && error.startsWith('errors.')) {
    const message = await serverTByLocale(locale, error)
    return createErrorResponse(message, ErrorCode.UNAUTHORIZED, 401)
  }

  // Erro com statusCode e message
  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    const errorObj = error as any
    let message = errorObj.message
    
    if (typeof message === 'string' && message.startsWith('errors.')) {
      message = await serverTByLocale(locale, message)
    }
    
    const errorCode = mapHttpStatusToErrorCode(errorObj.statusCode)
    return createErrorResponse(message, errorCode, errorObj.statusCode, undefined, errorObj.data)
  }

  // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let messageKey: string
    let statusCode: number

    switch (error.code) {
      case 'P2002':
        messageKey = 'errors.duplicateEntry'
        statusCode = 409
        break
      case 'P2025':
        messageKey = 'errors.recordNotFound'
        statusCode = 404
        break
      case 'P2003':
        messageKey = 'errors.foreignKeyConstraint'
        statusCode = 400
        break
      default:
        messageKey = 'errors.databaseError'
        statusCode = 400
    }

    const message = await serverTByLocale(locale, messageKey)
    const errorCode = mapPrismaErrorCode(error.code)
    
    return createErrorResponse(
      message, 
      errorCode, 
      statusCode, 
      undefined, 
      {
        prismaCode: error.code,
        meta: error.meta || {}
      }
    )
  }

  // Erros JavaScript padrão
  if (error instanceof Error) {
    const message = await serverTByLocale(locale, 'errors.internalServerError')
    const errorResponse = createErrorResponse(message, ErrorCode.INTERNAL_SERVER_ERROR, 500)
    
    // Incluir stack trace em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = error.stack
    }
    
    return errorResponse
  }

  // Erro desconhecido
  const message = await serverTByLocale(locale, 'errors.unknownError')
  return createErrorResponse(message, ErrorCode.UNKNOWN_ERROR, 500)
}

/**
 * Utility para criar erro de validação
 */
export async function createValidationError(
  locale: string,
  field?: string,
  validationErrors?: Record<string, string[]>
): Promise<ErrorResponse> {
  const message = await serverTByLocale(locale, 'errors.validationFailed')
  
  return createErrorResponse(
    message,
    ErrorCode.VALIDATION_ERROR,
    422,
    field,
    validationErrors ? { validationErrors } : undefined
  )
}

/**
 * Utility para criar erro de autorização
 */
export async function createAuthError(
  locale: string,
  errorCode: ErrorCode = ErrorCode.UNAUTHORIZED
): Promise<ErrorResponse> {
  let messageKey: string
  let statusCode: number

  switch (errorCode) {
    case ErrorCode.TOKEN_EXPIRED:
      messageKey = 'errors.tokenExpired'
      statusCode = 401
      break
    case ErrorCode.FORBIDDEN:
      messageKey = 'errors.accessDenied'
      statusCode = 403
      break
    default:
      messageKey = 'errors.unauthorized'
      statusCode = 401
  }

  const message = await serverTByLocale(locale, messageKey)
  return createErrorResponse(message, errorCode, statusCode)
}

/**
 * Utility para criar erro de recurso não encontrado
 */
export async function createNotFoundError(
  locale: string,
  resource?: string
): Promise<ErrorResponse> {
  const message = await serverTByLocale(locale, 'errors.recordNotFound')
  return createErrorResponse(
    resource ? `${resource} ${message.toLowerCase()}` : message,
    ErrorCode.RECORD_NOT_FOUND,
    404
  )
}
