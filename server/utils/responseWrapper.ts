import type { 
  ApiResponse, 
  SuccessResponse, 
  ErrorResponse, 
  ErrorDetails, 
  ErrorCode, 
  ResponseMeta 
} from '#shared/types/api-response'

/**
 * Cria uma response de sucesso padronizada
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: ResponseMeta
): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    success: true,
    data
  }
  
  if (message) {
    response.message = message
  }
  
  if (meta) {
    response.meta = meta
  }
  
  return response
}

/**
 * Cria uma response de erro padronizada
 */
export function createErrorResponse(
  message: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  statusCode: number = 500,
  field?: string,
  details?: Record<string, any>
): ErrorResponse {
  const errorDetails: ErrorDetails = {
    message,
    code,
    statusCode
  }
  
  if (field) {
    errorDetails.field = field
  }
  
  if (details) {
    errorDetails.details = details
  }
  
  // Incluir stack trace apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorDetails.stack = new Error().stack
  }
  
  return {
    success: false,
    error: errorDetails,
    data: null
  }
}

/**
 * Wrapper para executar operações com tratamento de erro padronizado
 */
export async function wrapAsyncOperation<T>(
  operation: () => Promise<T>,
  errorContext?: string
): Promise<ApiResponse<T>> {
  try {
    const result = await operation()
    return createSuccessResponse(result)
  } catch (error) {
    console.error(`Error in ${errorContext || 'async operation'}:`, error)
    
    // Se já é um ErrorResponse, retorna como está
    if (error && typeof error === 'object' && 'success' in error && error.success === false) {
      return error as ErrorResponse
    }
    
    // Converte erro genérico para ErrorResponse
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return createErrorResponse(message, ErrorCode.INTERNAL_SERVER_ERROR, 500)
  }
}

/**
 * Mapeia códigos de erro Prisma para ErrorCode
 */
export function mapPrismaErrorCode(prismaCode: string): ErrorCode {
  switch (prismaCode) {
    case 'P2002':
      return ErrorCode.DUPLICATE_ENTRY
    case 'P2025':
      return ErrorCode.RECORD_NOT_FOUND
    case 'P2003':
      return ErrorCode.FOREIGN_KEY_CONSTRAINT
    default:
      return ErrorCode.DATABASE_ERROR
  }
}

/**
 * Mapeia status HTTP para ErrorCode
 */
export function mapHttpStatusToErrorCode(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400:
      return ErrorCode.BAD_REQUEST
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 409:
      return ErrorCode.RESOURCE_CONFLICT
    case 422:
      return ErrorCode.VALIDATION_ERROR
    case 500:
      return ErrorCode.INTERNAL_SERVER_ERROR
    case 503:
      return ErrorCode.SERVICE_UNAVAILABLE
    default:
      return ErrorCode.UNKNOWN_ERROR
  }
}

/**
 * Utility para criar response de validação com detalhes dos campos
 */
export function createValidationErrorResponse(
  message: string,
  validationErrors?: Record<string, string[]>
): ErrorResponse {
  return createErrorResponse(
    message,
    ErrorCode.VALIDATION_ERROR,
    422,
    undefined,
    validationErrors ? { validationErrors } : undefined
  )
}

/**
 * Utility para criar response de paginação
 */
export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): SuccessResponse<T[]> {
  const hasNextPage = page * limit < total
  const hasPreviousPage = page > 1
  
  return createSuccessResponse(
    data,
    message,
    {
      total,
      page,
      limit,
      hasNextPage,
      hasPreviousPage
    }
  )
}

/**
 * Type guard para verificar se é uma ApiResponse
 */
export function isApiResponse<T>(value: any): value is ApiResponse<T> {
  return value && typeof value === 'object' && 'success' in value
}