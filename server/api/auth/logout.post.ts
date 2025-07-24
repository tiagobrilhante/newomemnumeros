import { defineEventHandler } from 'h3'
import { clearAuthCookie } from '~/server/utils/cookieAuth'
import { handleError } from '~/server/utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  
  try {
    clearAuthCookie(event)
    return {
      success: true,
      message: await serverTByLocale(locale, 'success.logoutSuccess')
    }
  } catch (error) {
    return handleError(error, locale)
  }
})
