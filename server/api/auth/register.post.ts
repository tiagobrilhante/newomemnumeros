import { registerUser } from '~/server/services/register.service'


// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)

    const locale = getLocale(event)

    return await registerUser(data, locale)
  } catch (error) {
    throw error
  }
})
