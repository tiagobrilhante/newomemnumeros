import { BaseTransformer } from './base.transformer'
import { RankTransformer } from './rank.transformer'
import { RoleTransformer } from './role.transformer'
import { SectionTransformer } from './section.transformer'
import type { UserWithIncludes } from './types'

export class UserTransformer extends BaseTransformer {
  static transform(user: UserWithIncludes) {
    const { password, createdAt, updatedAt, deleted, rank, role, section, ...cleanUser } = user

    return {
      ...cleanUser,
      rank: RankTransformer.transform(rank),
      ...(role && { role: RoleTransformer.transform(role) }),
      ...(section && { section: SectionTransformer.transform(section) })
    }
  }

  static transformForAuth(user: UserWithIncludes) {
    const { password, rankId, roleId, sectionId, createdAt, updatedAt, deleted, rank, role, section, ...cleanUser } = user

    return {
      ...cleanUser,
      rank: RankTransformer.transformForAuth(rank),
      ...(role && { role: RoleTransformer.transformForAuth(role) }),
      ...(section && { section: SectionTransformer.transformForAuth(section) })
    }
  }

  static collection(users: UserWithIncludes[]) {
    return users.map(user => this.transform(user))
  }
}
