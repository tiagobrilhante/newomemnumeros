// Tipos de erro padronizados
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Database
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Client
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Detalhes do erro
export interface ErrorDetails {
  message: string
  code: ErrorCode
  statusCode: number
  field?: string // Para erros de validação específicos
  details?: Record<string, any> // Informações adicionais
  stack?: string // Stack trace (apenas em desenvolvimento)
}

// Metadados para paginação e outros
export interface ResponseMeta {
  total?: number
  page?: number
  limit?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  [key: string]: any
}

// Response de sucesso
export interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
  meta?: ResponseMeta
}

// Response de erro
export interface ErrorResponse {
  success: false
  error: ErrorDetails
  data?: null
}

// Union type para todas as responses
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// Type guards
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.success === false
}

// Backward compatibility (será removido gradualmente)
export interface LegacyApiResponse<T> {
  success: boolean
  data: T
  message: string
  statusCode: number
}