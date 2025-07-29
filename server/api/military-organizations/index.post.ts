import { createMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import {
  militaryOrganizationCreateSchema,
  validateMilitaryOrganizationData,
  createValidationError
} from '../../schemas/militaryOrganization.schema'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    const validation = await validateMilitaryOrganizationData(
      militaryOrganizationCreateSchema,
      body,
      locale
    )

    if (!validation.success) {
      throw await createValidationError(validation.errors, locale)
    }

    return await createMilitaryOrganization(validation.data, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
