import { registerUser } from '~/server/services/register.service'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)
    return await registerUser(data)
  } catch (error) {
    console.error('Erro no registro:', error)
    throw error
  }
})
