import type { MilitaryOrganization } from '@prisma/client'
import { BaseTransformer } from './base.transformer'

export class MilitaryOrganizationTransformer extends BaseTransformer {
  static transform(militaryOrganization: MilitaryOrganization) {
    return this.removeAuditFields(militaryOrganization)
  }

  static transformForAuth(militaryOrganization: MilitaryOrganization) {
    return this.removeAuditFields(militaryOrganization)
  }

  static collection(militaryOrganizations: MilitaryOrganization[]) {
    return this.removeAuditFieldsFromCollection(militaryOrganizations)
  }
}
