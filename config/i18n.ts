import type { SupportedLocale } from '~/types/i18n'

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['pt-BR', 'en-US'] as const

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR'

export const isValidLocale = (lang: string): lang is SupportedLocale => {
  return (SUPPORTED_LOCALES as readonly string[]).includes(lang)
}

export const getValidLocaleOrDefault = (lang: string): SupportedLocale => {
  return isValidLocale(lang) ? lang : DEFAULT_LOCALE
}
