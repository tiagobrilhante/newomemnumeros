import { getMilitaryOrganizationById } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: await serverTByLocale(locale, 'errors.invalidId'),
    })
  }

  try {
    return await getMilitaryOrganizationById(id, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
