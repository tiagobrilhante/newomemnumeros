import prisma from '../prisma'
import { handleError } from '../utils/errorHandler'
import { serverTByLocale } from '../utils/i18n'
import { createError } from 'h3'

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

    return ranks
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

    return rank
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

    return newRank
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

    return updatedRank
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

    return null
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

    return ranks
  } catch (error) {
    throw await handleError(error, locale)
  }
}
