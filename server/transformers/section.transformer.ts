import { BaseTransformer } from './base.transformer'
import { MilitaryOrganizationTransformer } from './militaryOrganization.transformer'
import type { SectionWithIncludes } from './types'

export class SectionTransformer extends BaseTransformer {
  static transform(section: SectionWithIncludes) {
    const { createdAt, updatedAt, deleted, militaryOrganization, ...cleanSection } = section

    return {
      ...cleanSection,
      militaryOrganization: MilitaryOrganizationTransformer.transform(militaryOrganization)
    }
  }

  static transformForAuth(section: SectionWithIncludes) {
    const { createdAt, updatedAt, deleted, militaryOrganization, ...cleanSection } = section

    return {
      ...cleanSection,
      militaryOrganization: MilitaryOrganizationTransformer.transformForAuth(militaryOrganization)
    }
  }

  static collection(sections: SectionWithIncludes[]) {
    return sections.map(section => this.transform(section))
  }
}
