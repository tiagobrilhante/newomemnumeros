import { prisma } from '../utils/prisma'
import { handleError } from '../utils/errorHandler'
import { MilitaryOrganizationTransformer } from '../transformers/militaryOrganization.transformer'

function isValidColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(color)
}

function sanitizeMilitaryOrganizationData(name: string, acronym: string) {
  const sanitizedData = sanitizeData({ name, acronym })
  const sanitizedName = sanitizedData.name
  const sanitizedAcronym = sanitizedData.acronym.toUpperCase()
  return { sanitizedName, sanitizedAcronym }
}

export async function getAllMilitaryOrganizations(locale: string) {
  try {
    const militaryOrganizations = await prisma.militaryOrganization.findMany({
      where: {
        deleted: false,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
      orderBy: [
        { militaryOrganizationId: 'asc' },
        { name: 'asc' },
      ],
    })

    return {
      success: true,
      data: MilitaryOrganizationTransformer.collection(militaryOrganizations),
      message: await serverTByLocale(locale, 'success.militaryOrganizationRetrieved') || 'Military organizations retrieved successfully',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function getMilitaryOrganizationById(id: string, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const militaryOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })

    if (!militaryOrganization) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    return {
      success: true,
      data: MilitaryOrganizationTransformer.transform(militaryOrganization),
      message: await serverTByLocale(locale, 'success.militaryOrganizationRetrieved') || 'Military organization found',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function createMilitaryOrganization(data: militaryOrganization, locale: string) {
  try {
    const { name, acronym, color, logo, militaryOrganizationId } = data

    if (!name || !acronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    // noinspection DuplicatedCode
    const { sanitizedName, sanitizedAcronym } = sanitizeMilitaryOrganizationData(name, acronym)

    if (!sanitizedName || !sanitizedAcronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    if (color && !isValidColor(color)) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidDataProvided') || 'Invalid color format',
      })
    }

    const existingOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        acronym: sanitizedAcronym,
        deleted: false,
      },
    })

    if (existingOrganization) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.duplicateEntry') || 'Military organization acronym already exists',
      })
    }

    if (militaryOrganizationId) {
      const parentOrganization = await prisma.militaryOrganization.findFirst({
        where: {
          id: militaryOrganizationId,
          deleted: false,
        },
      })

      if (!parentOrganization) {
        return createError({
          statusCode: 400,
          message: await serverTByLocale(locale, 'errors.recordNotFound') || 'Parent military organization not found',
        })
      }
    }

    const newMilitaryOrganization = await prisma.militaryOrganization.create({
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        color: color || '#1976d2',
        logo: logo || '/logos/default/default.png',
        militaryOrganizationId,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })

    return {
      success: true,
      data: MilitaryOrganizationTransformer.transform(newMilitaryOrganization),
      message: await serverTByLocale(locale, 'success.militaryOrganizationCreated'),
      statusCode: 201,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function updateMilitaryOrganization(data: militaryOrganization, locale: string) {
  try {
    const { id, name, acronym, color, logo, militaryOrganizationId } = data

    if (!id || !name || !acronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    if (isNaN(Number(id))) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    // noinspection DuplicatedCode
    const { sanitizedName, sanitizedAcronym } = sanitizeMilitaryOrganizationData(name, acronym)

    if (!sanitizedName || !sanitizedAcronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    if (color && !isValidColor(color)) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidDataProvided') || 'Invalid color format',
      })
    }

    const existingOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!existingOrganization) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    const duplicateOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        acronym: sanitizedAcronym,
        id,
        deleted: false,
      },
    })

    if (duplicateOrganization) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.duplicateEntry') || 'Military organization acronym already exists',
      })
    }

    if (militaryOrganizationId) {
      const parentOrganization = await prisma.militaryOrganization.findFirst({
        where: {
          id: militaryOrganizationId,
          deleted: false,
        },
      })

      if (!parentOrganization) {
        return createError({
          statusCode: 400,
          message: await serverTByLocale(locale, 'errors.recordNotFound') || 'Parent military organization not found',
        })
      }

      if (Number(militaryOrganizationId) === Number(id)) {
        return createError({
          statusCode: 400,
          message: await serverTByLocale(locale, 'errors.invalidHierarchy') || 'Organization cannot be its own parent',
        })
      }
    }

    const updatedMilitaryOrganization = await prisma.militaryOrganization.update({
      where: {
        id,
      },
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        color: color || existingOrganization.color,
        logo: logo || existingOrganization.logo,
        militaryOrganizationId: militaryOrganizationId,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })

    return {
      success: true,
      data: MilitaryOrganizationTransformer.transform(updatedMilitaryOrganization),
      message: await serverTByLocale(locale, 'success.militaryOrganizationUpdated'),
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function deleteMilitaryOrganization(id: string, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const existingOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
      },
    })

    if (!existingOrganization) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    if (existingOrganization.subOrganizations && existingOrganization.subOrganizations.length > 0) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.foreignKeyConstraint') || 'Cannot delete organization with sub-organizations',
      })
    }

    await prisma.militaryOrganization.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        updatedAt: new Date(),
      },
    })

    return {
      success: true,
      data: null,
      message: await serverTByLocale(locale, 'success.militaryOrganizationDeleted'),
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function deleteMilitaryOrganizationLogo(id: string, locale: string) {
  try {
    if (!id || isNaN(Number(id))) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const existingOrganization = await prisma.militaryOrganization.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    })

    if (!existingOrganization) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    const updatedOrganization = await prisma.militaryOrganization.update({
      where: {
        id,
      },
      data: {
        logo: '/logos/default/default.png',
        updatedAt: new Date(),
      },
      include: {
        subOrganizations: {
          where: {
            deleted: false,
          },
        },
        parentOrganization: {
          where: {
            deleted: false,
          },
        },
      },
    })

    return {
      success: true,
      data: MilitaryOrganizationTransformer.transform(updatedOrganization),
      message: await serverTByLocale(locale, 'success.militaryOrganizationLogoDeleted'),
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}
