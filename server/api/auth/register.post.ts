import { registerUser } from '~/server/services/register.service'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  try {
    const data = await readBody(event)
    return await registerUser(data, locale)
  } catch (error: any) {
    if (error?.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: await serverTByLocale(locale, 'errors.internalRegistrationError'),
    })
  }
})


