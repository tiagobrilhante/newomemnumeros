import type { MilitaryOrganization } from '@prisma/client'
import { BaseTransformer } from './base.transformer'

type MilitaryOrganizationWithRelations = MilitaryOrganization & {
  subOrganizations?: MilitaryOrganization[]
  parentOrganization?: MilitaryOrganization | null
}

export class MilitaryOrganizationTransformer extends BaseTransformer {
  static transform(militaryOrganization: MilitaryOrganizationWithRelations) {
    const {
      subOrganizations,
      parentOrganization,
      createdAt,
      updatedAt,
      deleted,
      ...cleanOrganization
    } = militaryOrganization

    return {
      ...cleanOrganization,
      ...(subOrganizations && {
        subOrganizations: this.removeAuditFieldsFromCollection(subOrganizations)
      }),
      ...(parentOrganization && {
        parentOrganization: this.removeAuditFields(parentOrganization)
      }),
    }
  }

  static transformForAuth(militaryOrganization: MilitaryOrganizationWithRelations) {
    const {
      id,
      name,
      acronym,
      color,
      logo,
      parentOrganization
    } = militaryOrganization

    return {
      id,
      name,
      acronym,
      color,
      logo,
      ...(parentOrganization && {
        parentOrganization: {
          id: parentOrganization.id,
          name: parentOrganization.name,
          acronym: parentOrganization.acronym
        }
      })
    }
  }

    static transformForList(militaryOrganization: MilitaryOrganizationWithRelations) {
    const {
      createdAt,
      updatedAt,
      deleted,
      subOrganizations,
      ...cleanOrganization
    } = militaryOrganization

    return {
      ...cleanOrganization,
      subOrganizationsCount: subOrganizations?.length || 0,
      ...(militaryOrganization.parentOrganization && {
        parentOrganization: {
          id: militaryOrganization.parentOrganization.id,
          name: militaryOrganization.parentOrganization.name,
          acronym: militaryOrganization.parentOrganization.acronym
        }
      })
    }
  }

    static collection(
    militaryOrganizations: MilitaryOrganizationWithRelations[],
    mode: 'full' | 'auth' | 'list' = 'list'
  ) {
    return militaryOrganizations.map(org => {
      switch (mode) {
        case 'full':
          return this.transform(org)
        case 'auth':
          return this.transformForAuth(org)
        case 'list':
        default:
          return this.transformForList(org)
      }
    })
  }


  static transformHierarchical(militaryOrganizations: MilitaryOrganizationWithRelations[]) {
    const rootOrganizations = militaryOrganizations.filter(org => !org.militaryOrganizationId)
    const subordinateOrganizations = militaryOrganizations.filter(org => org.militaryOrganizationId)

    const buildHierarchy = (parentId: string | null): any[] => {
      return subordinateOrganizations
        .filter(org => org.militaryOrganizationId === parentId)
        .map(org => ({
          ...this.transform(org),
          children: buildHierarchy(org.id)
        }))
    }

    return rootOrganizations.map(rootOrg => ({
      ...this.transform(rootOrg),
      children: buildHierarchy(rootOrg.id)
    }))
  }

  static transformForSelect(militaryOrganizations: MilitaryOrganizationWithRelations[]) {
    return militaryOrganizations.map(org => ({
      id: org.id,
      name: org.name,
      acronym: org.acronym,
      label: `${org.acronym} - ${org.name}`,
      value: org.id.toString(),
      isParent: !org.militaryOrganizationId,
      parentId: org.militaryOrganizationId
    }))
  }
}
