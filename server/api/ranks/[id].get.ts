import prisma from '~/server/prisma'
import { handleError } from '~/server/utils/errorHandler'

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
    const rank = await prisma.rank.findUnique({
      where: {
        id,
      },
    })

    if (!rank) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.rankNotFound'),
      })
    }

    return rank
  } catch (error) {
    throw await handleError(error, locale)
  }
})
