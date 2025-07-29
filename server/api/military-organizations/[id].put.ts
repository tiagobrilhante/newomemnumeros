import { updateMilitaryOrganization } from '../../services/militaryOrganization.service'
import { handleError } from '../../utils/errorHandler'
import {
  militaryOrganizationUpdateSchema,
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
    const body = await readBody(event)
    const data = { ...body, id: paramValidation.data.id }

    const validation = await validateMilitaryOrganizationData(
      militaryOrganizationUpdateSchema,
      data,
      locale
    )

    if (!validation.success) {
      throw await createValidationError(validation.errors, locale)
    }

    return await updateMilitaryOrganization(validation.data, locale)
  } catch (error) {
    throw await handleError(error, locale)
  }
})
