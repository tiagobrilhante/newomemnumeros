import type { Rank } from '@prisma/client'
import { BaseTransformer } from './base.transformer'

export class RankTransformer extends BaseTransformer {
  static transform(rank: Rank) {
    return this.removeAuditFields(rank)
  }

  static transformForAuth(rank: Rank) {
    const { id, createdAt, updatedAt, deleted, ...cleanRank } = rank
    return cleanRank
  }

  static collection(ranks: Rank[]) {
    return this.removeAuditFieldsFromCollection(ranks)
  }
}
