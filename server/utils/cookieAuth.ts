import { getCookie, setCookie, deleteCookie } from 'h3'
import type { H3Event } from 'h3'

export const AUTH_COOKIE_NAME = 'auth-token'

export const getTokenFromRequest = (event: H3Event): string | null => {
  return getCookie(event, AUTH_COOKIE_NAME) || null
}

export const setAuthCookie = (event: H3Event, token: string) => {
  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/'
  })
}

export const clearAuthCookie = (event: H3Event) => {
  setCookie(event, AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  })

  deleteCookie(event, AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
}
