import { readFile } from 'fs/promises'
import { resolve } from 'path'
import type { H3Event } from 'h3'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '~/config/i18n'

const supportedLocales = SUPPORTED_LOCALES as readonly string[]
const defaultLocale = DEFAULT_LOCALE

const localeCache = new Map<string, any>()

export function getLocale(event: H3Event): string {
  const cookieLocale = getCookie(event, 'i18n_redirected')
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale
  }

  const headerLocale = getRequestHeader(event, 'accept-language')?.split(',')[0]
  if (headerLocale && supportedLocales.includes(headerLocale)) {
    if (headerLocale.toLowerCase() === 'en-us') return 'en-US'
    return headerLocale
  }

  return defaultLocale
}

export async function serverTByLocale(locale: string, key: string): Promise<string> {
  try {
    if (!localeCache.has(locale)) {
      const filePath = resolve(process.cwd(), 'i18n', 'locales', `${locale}.json`)
      const fileContent = await readFile(filePath, 'utf-8')
      const messages = JSON.parse(fileContent)
      localeCache.set(locale, messages)
    }

    const messages = localeCache.get(locale)
    const translation = key.split('.').reduce((obj, k) => obj?.[k], messages)
    return translation || key
  } catch (error) {
    console.error(`Could not load locale file for: ${locale}`, error)
    return key
  }
}
