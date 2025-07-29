import { deleteMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import {
  militaryOrganizationParamsSchema,
  validateMilitaryOrganizationData,
  createValidationError
} from '../../schemas/militaryOrganization.schema'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const id = getRouterParam(event, 'id')

  const paramValidation = await validateMilitaryOrganizationData(
    militaryOrganizationParamsSchema,
    { id },
    locale
  )

  if (!paramValidation.success) {
    throw await createValidationError(paramValidation.errors, locale)
  }

  try {
    return await deleteMilitaryOrganization(paramValidation.data.id, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
