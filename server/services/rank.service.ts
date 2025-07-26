import prisma from '../prisma'
import { handleError } from '../utils/errorHandler'

export async function getAllRanks(locale: string) {
  try {
    const ranks = await prisma.rank.findMany({
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

    return {
      success: true,
      data: ranks,
      message: await serverTByLocale(locale, 'success.ranksRetrieved'),
      statusCode: 200
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function getRankById(id: string, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const rank = await prisma.rank.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        acronym: true,
        hierarchy: true,
      },
    })

    if (!rank) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.rankNotFound'),
      })
    }

    return {
      success: true,
      data: rank,
      message: await serverTByLocale(locale, 'success.rankRetrieved'),
      statusCode: 200
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function createRank(data: { name: string; acronym: string; hierarchy: number }, locale: string) {
  try {
    if (!data.name || !data.acronym || data.hierarchy === undefined) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    const newRank = await prisma.rank.create({
      data: {
        name: data.name,
        acronym: data.acronym,
        hierarchy: data.hierarchy,
      },
    })

    return {
      success: true,
      data: newRank,
      message: await serverTByLocale(locale, 'success.rankCreated'),
      statusCode: 201
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function updateRank(id: string, data: Partial<{ name: string; acronym: string; hierarchy: number }>, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const existingRank = await prisma.rank.findUnique({
      where: { id }
    })

    if (!existingRank) {
      return  createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.rankNotFound'),
      })
    }

    const updatedRank = await prisma.rank.update({
      where: { id },
      data: data,
    })

    return {
      success: true,
      data: updatedRank,
      message: await serverTByLocale(locale, 'success.rankUpdated'),
      statusCode: 200
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function deleteRank(id: string, locale: string) {
  try {

    if (!id) {
      return  createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const existingRank = await prisma.rank.findUnique({
      where: { id }
    })

    if (!existingRank) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.rankNotFound'),
      })
    }

    await prisma.rank.delete({
      where: { id },
    })

    return {
      success: true,
      message: await serverTByLocale(locale, 'success.rankDeleted'),
      statusCode: 200
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function getRanksByHierarchy(hierarchy: number, locale: string) {
  try {

    if (!hierarchy || isNaN(hierarchy)) {
      return  createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidHierarchy'),
      })
    }

    const ranks = await prisma.rank.findMany({
      where: {
        hierarchy,
      },
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

    return {
      success: true,
      data: ranks,
      message: await serverTByLocale(locale, 'success.ranksByHierarchyRetrieved'),
      statusCode: 200
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}
