import prisma from '../prisma'
import { handleError } from '../utils/errorHandler'
import { SectionTransformer } from '../transformers/section.transformer'
import { serverTByLocale } from '../utils/i18n'
import { createError } from 'h3'

import type {
  SectionCreateInput,
  SectionUpdateInput
} from '../schemas/section.schema'
import type { SectionWithIncludes } from '../transformers/types'

function sanitizeSectionData(name: string, acronym: string) {
  const sanitizedData = sanitizeData({ name, acronym })
  const sanitizedName = sanitizedData.name
  const sanitizedAcronym = sanitizedData.acronym  // Manter case original
  return { sanitizedName, sanitizedAcronym }
}

export async function getAllSections(locale: string) {
  try {
    const sections = await prisma.section.findMany({
      where: {
        deleted: false,
      },
      include: {
        militaryOrganization: true
      },
      orderBy: [
        { name: 'asc' },
      ],
    })

    return {
      success: true,
      data: SectionTransformer.collection(sections),
      message: await serverTByLocale(locale, 'success.sectionsRetrieved') || 'Sections retrieved successfully',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function getSectionById(id: string, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const section = await prisma.section.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
       militaryOrganization: true,
      },
    })

    if (!section) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    return {
      success: true,
      data: SectionTransformer.transform(section as SectionWithIncludes),
      message: await serverTByLocale(locale, 'success.sectionRetrieved') || 'Section found',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function createSection(data: SectionCreateInput, locale: string) {
  try {
    const { name, acronym, militaryOrganizationId } = data

    const { sanitizedName, sanitizedAcronym } = sanitizeSectionData(name, acronym)

    if (!militaryOrganizationId) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired') || 'Military organization ID is required',
      })
    }

    const existingSections = await prisma.section.findMany({
      where: {
        militaryOrganizationId: militaryOrganizationId,
        deleted: false,
      },
      select: {
        id: true,
        acronym: true,
      },
    })

    const existingSection = existingSections.find(
      section => section.acronym.toLowerCase() === sanitizedAcronym.toLowerCase()
    )

    if (existingSection) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.duplicateEntry') || 'Section acronym already exists',
      })
    }

    const mo = await prisma.militaryOrganization.findFirst({
      where: {
        id: militaryOrganizationId,
        deleted: false,
      },
    })

    if (!mo) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.recordNotFound') || 'Military organization not found',
      })
    }

    const newSection = await prisma.section.create({
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        militaryOrganizationId: militaryOrganizationId,
      },
      include: {
        militaryOrganization: true
      },
    })


    return {
      success: true,
      data: SectionTransformer.transform(newSection as SectionWithIncludes),
      message: await serverTByLocale(locale, 'success.sectionCreated') || 'Section created successfully',
      statusCode: 201,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function updateSection(data: SectionUpdateInput, locale: string) {
  try {
    const { id, name, acronym, militaryOrganizationId } = data

    if (!name || !acronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    // noinspection DuplicatedCode
    const { sanitizedName, sanitizedAcronym } = sanitizeSectionData(name, acronym)

    if (!sanitizedName || !sanitizedAcronym) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    const existingSection = await prisma.section.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!existingSection) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    const allSections = await prisma.section.findMany({
      where: {
        NOT: { id },
        militaryOrganizationId: militaryOrganizationId,
        deleted: false,
      },
      select: {
        id: true,
        acronym: true,
      },
    })

    const duplicateSection = allSections.find(
      section => section.acronym.toLowerCase() === sanitizedAcronym.toLowerCase()
    )

    if (duplicateSection) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.duplicateEntry') || 'Section acronym already exists',
      })
    }

    if (militaryOrganizationId) {
      const mo = await prisma.militaryOrganization.findFirst({
        where: {
          id: militaryOrganizationId,
          deleted: false,
        },
      })

      if (!mo) {
        return createError({
          statusCode: 400,
          message: await serverTByLocale(locale, 'errors.recordNotFound') || 'Parent military organization not found',
        })
      }
    }

    const updatedSection = await prisma.section.update({
      where: {
        id,
      },
      data: {
        name: sanitizedName,
        acronym: sanitizedAcronym,
        militaryOrganizationId: militaryOrganizationId,
      },
      include: {
        militaryOrganization: true
      },
    })

    return {
      success: true,
      data: SectionTransformer.transform(updatedSection as SectionWithIncludes),
      message: await serverTByLocale(locale, 'success.sectionUpdated') || 'Section updated successfully',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}

export async function deleteSection(id: string, locale: string) {
  try {
    if (!id) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.invalidId'),
      })
    }

    const existingSection = await prisma.section.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!existingSection) {
      return createError({
        statusCode: 404,
        message: await serverTByLocale(locale, 'errors.recordNotFound'),
      })
    }

    await prisma.roleSection.updateMany({
      where: {
        sectionId: id,
        deleted: false,
      },
      data: {
        deleted: true,
        updatedAt: new Date(),
      },
    })

    await prisma.user.updateMany({
      where: {
        sectionId: id,
        deleted: false,
      },
      data: {
        sectionId: null,
        updatedAt: new Date(),
      },
    })

    await prisma.section.update({
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
      message: await serverTByLocale(locale, 'success.sectionDeleted') || 'Section deleted successfully',
      statusCode: 200,
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}
