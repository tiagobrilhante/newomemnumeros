export interface ErrorHandlerOptions {
  statusCode?: number
  statusMessageKey?: string
  fallbackStatusMessage?: string
  fallbackMessage?: string
}

/**
 * Centraliza o tratamento de erros no frontend/middleware
 * Similar ao handleError do servidor, mas adaptado para o contexto client-side
 */
export function createAppError(
  messageKey: string, 
  options: ErrorHandlerOptions = {}
) {
  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp
  
  const {
    statusCode = 500,
    statusMessageKey,
    fallbackStatusMessage = 'Internal Server Error',
    fallbackMessage = 'An error occurred'
  } = options

  // Tenta traduzir a mensagem
  let message: string
  try {
    message = $i18n?.t(messageKey) || fallbackMessage
  } catch {
    message = fallbackMessage
  }

  // Tenta traduzir o statusMessage se uma chave for fornecida
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

  return createError({
    statusCode,
    statusMessage,
    message
  })
}

/**
 * Versões específicas para erros comuns
 */
export const createForbiddenError = (messageKey = 'errors.accessDenied') => {
  return createAppError(messageKey, {
    statusCode: 403,
    statusMessage: 'Forbidden',
    fallbackMessage: 'Acesso Negado'
  })
}

export const createNotFoundError = (messageKey = 'errors.recordNotFound') => {
  return createAppError(messageKey, {
    statusCode: 404,
    statusMessage: 'Not Found',
    fallbackMessage: 'Recurso não encontrado'
  })
}

export const createUnauthorizedError = (messageKey = 'errors.invalidToken') => {
  return createAppError(messageKey, {
    statusCode: 401,
    statusMessage: 'Unauthorized',
    fallbackMessage: 'Não autorizado'
  })
}