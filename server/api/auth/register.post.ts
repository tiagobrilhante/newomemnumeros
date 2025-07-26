import { registerUser } from '../../services/register.service'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    const data = await readBody(event)
    return await registerUser(data, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
