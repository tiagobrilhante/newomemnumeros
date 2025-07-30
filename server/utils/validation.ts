import { z } from 'zod'
import { serverTByLocale } from './i18n'
import { createError } from 'h3'

export interface ValidationResult<T> {
  success: true
  data: T
}

export interface ValidationError {
  success: false
  errors: string[]
}

export type ValidationResponse<T> = ValidationResult<T> | ValidationError

/**
 * Valida dados usando um schema Zod e retorna resultado padronizado
 */
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  locale: string = 'pt-BR'
): Promise<ValidationResponse<T>> {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })
      return { success: false, errors }
    }

    const unknownErrorMessage = await serverTByLocale(locale, 'validation.unknownError') || 'Erro de validação desconhecido'
    return { success: false, errors: [unknownErrorMessage] }
  }
}

/**
 * Cria um erro HTTP padronizado a partir de erros de validação
 */
export async function createValidationError(errors: string[], locale: string = 'pt-BR') {
  const message = await serverTByLocale(locale, 'validation.invalidInputData') || 'Dados de entrada inválidos'

  return createError({
    statusCode: 400,
    statusMessage: 'Validation Error',
    message,
    data: {
      errors,
      type: 'validation_error'
    }
  })
}