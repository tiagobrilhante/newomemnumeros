import prisma from '~/server/prisma'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  try {
    return await prisma.rank.findMany({
      select: {
        id: true,
        name: true,
        acronym: true,
        hierarchy: true,
      },
      orderBy: {
        hierarchy: 'asc',
      },
    })
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: await serverTByLocale(locale, 'errors.serverCommunication'),
    })
  }
})
