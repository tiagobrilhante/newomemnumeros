import { toast } from 'vue3-toastify'
import type { ApiResponse } from '#shared/types/api-response'
import type { EnhancedError } from '~/utils/clientErrorHandler'
import { enhanceError, ErrorContext, getUserFriendlyMessage, logError, processApiError } from '~/utils/clientErrorHandler'


export interface RetryOptions {
  attempts: number
  delay: number
  backoffMultiplier?: number
  retryCondition?: (error: EnhancedError) => boolean
}

export interface ErrorHandlerConfig {
  context?: ErrorContext
  showToast?: boolean
  logError?: boolean
  retryOptions?: RetryOptions
  onError?: (error: EnhancedError) => void
  onRetry?: (attempt: number, error: EnhancedError) => void
  onMaxRetriesReached?: (error: EnhancedError) => void
  fallbackValue?: any
  useErrorBoundary?: boolean
}

export interface UseErrorHandlerReturn<T> {
  data: ComputedRef<T | null>
  error: ComputedRef<EnhancedError | null>
  loading: ComputedRef<boolean>
  retrying: ComputedRef<boolean>
  retryCount: ComputedRef<number>
  execute: () => Promise<T | null>
  retry: () => Promise<T | null>
  clear: () => void
  reset: () => void
}

/**
 * Composable genérico para tratamento de erros com retry logic, logging e toast notifications
 */
export function useErrorHandler<T>(
  asyncFunction: () => Promise<T>,
  config: ErrorHandlerConfig = {},
): UseErrorHandlerReturn<T> {
  const {
    context,
    showToast = true,
    logError: shouldLogError = true,
    retryOptions,
    onError,
    onRetry,
    onMaxRetriesReached,
    fallbackValue = null,
    useErrorBoundary = false,
  } = config

  // Reactive state
  const data = ref<T | null>(null)
  const error = ref<EnhancedError | null>(null)
  const loading = ref(false)
  const retrying = ref(false)
  const retryCount = ref(0)

  /**
   * Handles error processing and side effects
   */
  const handleError = (err: unknown): EnhancedError => {
    let enhancedError: EnhancedError

    // Process API response errors
    if (err && typeof err === 'object' && 'success' in err) {
      const apiError = processApiError(err as ApiResponse<any>)
      enhancedError = apiError || enhanceError(err, context)
    } else {
      enhancedError = enhanceError(err, context)
    }

    error.value = enhancedError

    // Log error if enabled
    if (shouldLogError) {
      logError(enhancedError, {
        functionContext: asyncFunction.name || 'anonymous',
        retryCount: retryCount.value,
      })
    }

    // Show toast notification if enabled
    if (showToast) {
      const message = getUserFriendlyMessage(enhancedError)
      toast.error(message)
    }

    // Call custom error handler
    if (onError) {
      onError(enhancedError)
    }

    // Throw error for error boundary if enabled
    if (useErrorBoundary) {
      throw enhancedError
    }

    return enhancedError
  }

  /**
   * Executes the async function with error handling
   */
  const execute = async (): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFunction()
      data.value = result
      retryCount.value = 0 // Reset retry count on success
      return result
    } catch (err) {
      const enhancedError = handleError(err)

      // Try retry logic if configured and error is retryable
      if (retryOptions && enhancedError.retryable && retryCount.value < retryOptions.attempts) {
        return await executeWithRetry(enhancedError)
      }

      return fallbackValue
    } finally {
      loading.value = false
    }
  }

  /**
   * Executes with retry logic
   */
  const executeWithRetry = async (initialError: EnhancedError): Promise<T | null> => {
    retrying.value = true

    for (let attempt = 1; attempt <= (retryOptions?.attempts || 0); attempt++) {
      retryCount.value = attempt

      // Call retry callback
      if (onRetry) {
        onRetry(attempt, initialError)
      }

      // Calculate delay with optional backoff
      const delay = (retryOptions?.delay || 1000) *
        Math.pow(retryOptions?.backoffMultiplier || 1, attempt - 1)

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay))

      try {
        const result = await asyncFunction()
        data.value = result
        retrying.value = false
        return result
      } catch (err) {
        const enhancedError = handleError(err)

        // Check if we should continue retrying
        if (retryOptions?.retryCondition && !retryOptions.retryCondition(enhancedError)) {
          break
        }

        // If this was the last attempt
        if (attempt === retryOptions?.attempts) {
          if (onMaxRetriesReached) {
            onMaxRetriesReached(enhancedError)
          }

          if (showToast) {
            const message = `Máximo de tentativas atingido: ${getUserFriendlyMessage(enhancedError)}`
            toast.error(message)
          }
        }
      }
    }

    retrying.value = false
    return fallbackValue
  }

  /**
   * Manual retry function
   */
  const retry = async (): Promise<T | null> => {
    if (loading.value || retrying.value) {
      return data.value
    }

    retryCount.value = 0
    return await execute()
  }

  /**
   * Clears error state
   */
  const clear = () => {
    error.value = null
  }

  /**
   * Resets all state
   */
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
    retrying.value = false
    retryCount.value = 0
  }

  const dataRO = computed(() => data.value)
  const errorRO = computed(() => error.value)
  const loadingRO = computed(() => loading.value)
  const retryingRO = computed(() => retrying.value)
  const retryCountRO = computed(() => retryCount.value)

  return {
    data: dataRO,
    error: errorRO,
    loading: loadingRO,
    retrying: retryingRO,
    retryCount: retryCountRO,
    execute,
    retry,
    clear,
    reset,
  }
}

/**
 * Simplified error handler for basic use cases
 */
export function useSimpleErrorHandler<T>(
  asyncFunction: () => Promise<T>,
  showToast = true,
) {
  return useErrorHandler(asyncFunction, {
    showToast,
    logError: true,
  })
}

/**
 * Error handler with retry logic for network operations
 */
export function useNetworkErrorHandler<T>(
  asyncFunction: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 1000,
) {
  return useErrorHandler(asyncFunction, {
    context: ErrorContext.NETWORK,
    showToast: true,
    logError: true,
    retryOptions: {
      attempts: maxRetries,
      delay: retryDelay,
      backoffMultiplier: 1.5,
      retryCondition: (error) => error.retryable,
    },
  })
}

/**
 * Error handler specifically for authentication operations
 */
export function useAuthErrorHandler<T>(
  asyncFunction: () => Promise<T>,
  onAuthError?: (error: EnhancedError) => void,
) {
  return useErrorHandler(asyncFunction, {
    context: ErrorContext.AUTHENTICATION,
    showToast: true,
    logError: true,
    onError: (error) => {
      if (error.statusCode === 401) {
        navigateTo('/')
      }

      if (onAuthError) {
        onAuthError(error)
      }
    },
  })
}

/**
 * Error handler for validation operations
 * Validation errors usually shown in forms
 * Validation errors are expected
 */
export function useValidationErrorHandler<T>(
  asyncFunction: () => Promise<T>,
  onValidationError?: (error: EnhancedError) => void,
) {
  return useErrorHandler(asyncFunction, {
    context: ErrorContext.VALIDATION,
    showToast: false,
    logError: false,
    onError: onValidationError,
  })
}
