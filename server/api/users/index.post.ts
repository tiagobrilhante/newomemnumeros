import { registerUser } from '../../services/register.service'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  try {
    const data = await readBody(event)
    return await registerUser(data, locale)
  } catch (error) {
    console.error('Erro no registro:', error)
    throw error
  }
})
