import { BaseTransformer } from './base.transformer'
import type { SectionWithIncludes } from './types'

export class SectionTransformer extends BaseTransformer {
  static transform(section: SectionWithIncludes) {
    const { createdAt, updatedAt, deleted, militaryOrganization, ...cleanSection } = section

    return {
      ...cleanSection,
      militaryOrganization: militaryOrganization ? {
        id: militaryOrganization.id,
        name: militaryOrganization.name,
        acronym: militaryOrganization.acronym,
        color: militaryOrganization.color,
        logo: militaryOrganization.logo
      } : null
    }
  }

  static collection(sections: SectionWithIncludes[]) {
    return sections.map(section => this.transform(section))
  }
}
