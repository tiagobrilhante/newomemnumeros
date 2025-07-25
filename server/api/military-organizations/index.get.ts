import { getAllMilitaryOrganizations } from '~/server/services/militaryOrganization.service'
import { handleError } from '~/server/utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    return await getAllMilitaryOrganizations(locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
