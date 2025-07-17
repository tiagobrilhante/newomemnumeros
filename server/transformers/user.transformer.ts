import { BaseTransformer } from './base.transformer'
import { RankTransformer } from './rank.transformer'
import { RoleTransformer } from './role.transformer'
import type { UserWithIncludes } from './types'

export class UserTransformer extends BaseTransformer {
  static transform(user: UserWithIncludes) {
    const { password, createdAt, updatedAt, deleted, rank, role, ...cleanUser } = user

    return {
      ...cleanUser,
      rank: RankTransformer.transform(rank),
      ...(role && { role: RoleTransformer.transform(role) })
    }
  }

  static transformForAuth(user: UserWithIncludes) {
    const { password, rankId, roleId, createdAt, updatedAt, deleted, rank, role, ...cleanUser } = user

    return {
      ...cleanUser,
      rank: RankTransformer.transformForAuth(rank),
      ...(role && { role: RoleTransformer.transformForAuth(role) })
    }
  }

  static collection(users: UserWithIncludes[]) {
    return users.map(user => this.transform(user))
  }
}
