import prisma from '../../prisma'
import { handleError } from '../../utils/errorHandler'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)

  try {
    const body = await readBody(event)

    if (!body.name || !body.acronym || body.hierarchy === undefined) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    return await prisma.rank.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        hierarchy: body.hierarchy,
      },
    })
  } catch (error) {
    throw await handleError(error, locale)
  }
})
