import type { ApiResponse, ErrorResponse } from '#shared/types/api-response'
import { ErrorCode } from '#shared/types/api-response'

// Context types para categorizar erros
export enum ErrorContext {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  USER_INPUT = 'USER_INPUT',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorHandlerOptions {
  statusCode?: number
  statusMessageKey?: string
  fallbackStatusMessage?: string
  fallbackMessage?: string
  context?: ErrorContext
  retryable?: boolean
  userFriendly?: boolean
}

export interface EnhancedError extends Error {
  statusCode: number
  statusMessage: string
  context: ErrorContext
  code?: ErrorCode
  retryable: boolean
  userFriendly: boolean
  timestamp: Date
  originalError?: Error
}

/**
 * Centraliza o tratamento de erros no frontend/middleware
 * Similar ao handleError do servidor, mas adaptado para o contexto client-side
 */
export function createAppError(
  messageKey: string,
  options: ErrorHandlerOptions = {}
): EnhancedError {
  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp

  const {
    statusCode = 500,
    statusMessageKey,
    fallbackStatusMessage = 'Internal Server Error',
    fallbackMessage = 'An error occurred',
    context = ErrorContext.UNKNOWN,
    retryable = false,
    userFriendly = true
  } = options

  let message: string
  try {
    message = $i18n?.t(messageKey) || fallbackMessage
  } catch {
    message = fallbackMessage
  }

  let statusMessage: string
  if (statusMessageKey) {
    try {
      statusMessage = $i18n?.t(statusMessageKey) || fallbackStatusMessage
    } catch {
      statusMessage = fallbackStatusMessage
    }
  } else {
    statusMessage = fallbackStatusMessage
  }

  const nuxtError = createError({
    statusCode,
    statusMessage,
    message,
  })

  // Enhance the NuxtError with additional properties to match EnhancedError
  return Object.assign(nuxtError, {
    statusMessage, // Re-assert statusMessage to satisfy the non-optional type
    context,
    retryable,
    userFriendly,
    timestamp: new Date(),
  })
}

/**
 * Enhances any error with additional context and information
 */
export function enhanceError(
  error: unknown,
  context: ErrorContext = ErrorContext.UNKNOWN,
  additionalInfo?: Record<string, any>
): EnhancedError {
  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp

  let enhancedError: EnhancedError

  if (error instanceof Error) {
    enhancedError = error as EnhancedError
    enhancedError.originalError = error
  } else {
    const message = typeof error === 'string' ? error : 'Unknown error occurred'
    enhancedError = new Error(message) as EnhancedError
  }

  // Set defaults if not already set
  if (!enhancedError.statusCode) {
    enhancedError.statusCode = 500
  }
  if (!enhancedError.statusMessage) {
    enhancedError.statusMessage = 'Internal Error'
  }
  if (!enhancedError.context) {
    enhancedError.context = context
  }
  if (enhancedError.retryable === undefined) {
    enhancedError.retryable = isRetryableError(enhancedError)
  }
  if (enhancedError.userFriendly === undefined) {
    enhancedError.userFriendly = true
  }
  if (!enhancedError.timestamp) {
    enhancedError.timestamp = new Date()
  }

  // Add additional info if provided
  if (additionalInfo) {
    Object.assign(enhancedError, additionalInfo)
  }

  return enhancedError
}

/**
 * Processes API response errors and converts them to enhanced errors
 */
export function processApiError(response: ApiResponse<any>): EnhancedError | null {
  if (response.success) {
    return null
  }

  const errorResponse = response as ErrorResponse
  const { error } = errorResponse

  const context = mapErrorCodeToContext(error.code)

  const enhancedError = createAppError(
    'errors.apiError',
    {
      statusCode: error.statusCode,
      fallbackMessage: error.message,
      context,
      retryable: isRetryableByCode(error.code),
      userFriendly: true
    }
  )

  enhancedError.code = error.code
  enhancedError.message = error.message

  if (error.details) {
    Object.assign(enhancedError, error.details)
  }

  return enhancedError
}

/**
 * Maps ErrorCode to ErrorContext
 */
function mapErrorCodeToContext(code: ErrorCode): ErrorContext {
  switch (code) {
    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.TOKEN_EXPIRED:
      return ErrorContext.AUTHENTICATION
    case ErrorCode.FORBIDDEN:
      return ErrorContext.AUTHORIZATION
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.MISSING_REQUIRED_FIELD:
    case ErrorCode.INVALID_FORMAT:
      return ErrorContext.VALIDATION
    case ErrorCode.NETWORK_ERROR:
    case ErrorCode.TIMEOUT_ERROR:
      return ErrorContext.NETWORK
    case ErrorCode.BUSINESS_RULE_VIOLATION:
    case ErrorCode.RESOURCE_CONFLICT:
      return ErrorContext.BUSINESS_LOGIC
    case ErrorCode.INTERNAL_SERVER_ERROR:
    case ErrorCode.SERVICE_UNAVAILABLE:
    case ErrorCode.DATABASE_ERROR:
      return ErrorContext.SYSTEM
    case ErrorCode.BAD_REQUEST:
      return ErrorContext.USER_INPUT
    default:
      return ErrorContext.UNKNOWN
  }
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: EnhancedError): boolean {
  if (error.code) {
    return isRetryableByCode(error.code)
  }

  // Check by status code
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
  return retryableStatusCodes.includes(error.statusCode)
}

/**
 * Determines if an error code is retryable
 */
function isRetryableByCode(code: ErrorCode): boolean {
  const retryableCodes = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.INTERNAL_SERVER_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE
  ]
  return retryableCodes.includes(code)
}

/**
 * Gets user-friendly message for an error
 */
export function getUserFriendlyMessage(error: EnhancedError): string {
  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp

  if (!error.userFriendly) {
    return $i18n?.t('errors.genericError') || 'Um erro inesperado ocorreu'
  }

  return error.message
}

/**
 * Logs error with appropriate level and context
 */
export function logError(error: EnhancedError, additionalContext?: Record<string, any>): void {
  const logData = {
    message: error.message,
    statusCode: error.statusCode,
    context: error.context,
    code: error.code,
    timestamp: error.timestamp,
    stack: error.stack,
    ...additionalContext
  }

  // In development, log to console with full details
  if (process.env.NODE_ENV === 'development') {
    console.error('Client Error:', logData)
  } else {
    // In production, could send to error monitoring service
    console.error(`[${error.context}] ${error.message}`)
  }
}

// Pre-configured error creators
export const createForbiddenError = (messageKey = 'errors.accessDenied') => {
  return createAppError(messageKey, {
    statusCode: 403,
    statusMessageKey: 'errors.status403Title',
    fallbackStatusMessage: 'Forbidden',
    fallbackMessage: 'Acesso Negado',
    context: ErrorContext.AUTHORIZATION
  })
}

export const createNotFoundError = (messageKey = 'errors.recordNotFound') => {
  return createAppError(messageKey, {
    statusCode: 404,
    statusMessageKey: 'errors.status404Title',
    fallbackStatusMessage: 'Not Found',
    fallbackMessage: 'Recurso não encontrado',
    context: ErrorContext.SYSTEM
  })
}

export const createUnauthorizedError = (messageKey = 'errors.invalidToken') => {
  return createAppError(messageKey, {
    statusCode: 401,
    statusMessageKey: 'errors.invalidToken',
    fallbackStatusMessage: 'Unauthorized',
    fallbackMessage: 'Não autorizado',
    context: ErrorContext.AUTHENTICATION
  })
}

export const createValidationError = (messageKey = 'errors.validationFailed') => {
  return createAppError(messageKey, {
    statusCode: 422,
    statusMessageKey: 'errors.validationError',
    fallbackStatusMessage: 'Validation Error',
    fallbackMessage: 'Dados inválidos',
    context: ErrorContext.VALIDATION
  })
}

export const createNetworkError = (messageKey = 'errors.networkError') => {
  return createAppError(messageKey, {
    statusCode: 0,
    statusMessageKey: 'errors.networkError',
    fallbackStatusMessage: 'Network Error',
    fallbackMessage: 'Erro de conexão',
    context: ErrorContext.NETWORK,
    retryable: true
  })
}
