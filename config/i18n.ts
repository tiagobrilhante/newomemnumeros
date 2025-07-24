import type { SupportedLocale } from '~/types/i18n'

// Configuração centralizada dos idiomas suportados
export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['pt-BR', 'en-US'] as const

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR'

// Função utilitária para validar se um idioma é suportado
export const isValidLocale = (lang: string): lang is SupportedLocale => {
  return (SUPPORTED_LOCALES as readonly string[]).includes(lang)
}

// Função para obter idioma com fallback
export const getValidLocaleOrDefault = (lang: string): SupportedLocale => {
  return isValidLocale(lang) ? lang : DEFAULT_LOCALE
}