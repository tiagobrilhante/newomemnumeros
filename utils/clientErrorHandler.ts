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

  return createError({
    statusCode,
    statusMessage,
    message
  })
}

// noinspection JSUnusedGlobalSymbols
export const createForbiddenError = (messageKey = 'errors.accessDenied') => {
  return createAppError(messageKey, {
    statusCode: 403,
    statusMessageKey: 'errors.status403Title',
    fallbackStatusMessage: 'Forbidden',
    fallbackMessage: 'Acesso Negado'
  })
}
// noinspection JSUnusedGlobalSymbols
export const createNotFoundError = (messageKey = 'errors.recordNotFound') => {
  return createAppError(messageKey, {
    statusCode: 404,
    statusMessageKey: 'errors.status404Title',
    fallbackStatusMessage: 'Not Found',
    fallbackMessage: 'Recurso não encontrado'
  })
}
// noinspection JSUnusedGlobalSymbols
export const createUnauthorizedError = (messageKey = 'errors.invalidToken') => {
  return createAppError(messageKey, {
    statusCode: 401,
    statusMessageKey: 'errors.invalidToken',
    fallbackStatusMessage: 'Unauthorized',
    fallbackMessage: 'Não autorizado'
  })
}
