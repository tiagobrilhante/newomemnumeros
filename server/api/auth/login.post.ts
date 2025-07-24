import { defineEventHandler, readBody } from 'h3'
import { authenticateUser } from '~/server/services/auth.service'
import { generateJwtToken } from '~/server/utils/jwtUtils'
import { handleError } from '~/server/utils/errorHandler'
import { setAuthCookie } from '~/server/utils/cookieAuth'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  
  try {
    const { email, password } = await readBody(event)
    const user = await authenticateUser(email, password)
    const token = generateJwtToken(user.id)
    setAuthCookie(event, token)
    return {
      user,
    }
  } catch (error) {
    return handleError(error, locale)
  }
})
