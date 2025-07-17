import { defineEventHandler } from 'h3'
import { clearAuthCookie } from '~/server/utils/cookieAuth'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {

    clearAuthCookie(event)
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    }
  } catch (error) {
    console.error('Erro no logout:', error)

    return {
      success: false,
      message: 'Erro ao fazer logout'
    }
  }
})
