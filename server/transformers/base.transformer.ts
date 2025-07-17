export class BaseTransformer {

  static removeAuditFields<T extends Record<string, any>>(obj: T): Omit<T, 'createdAt' | 'updatedAt' | 'deleted'> {
    const { createdAt, updatedAt, deleted, ...cleanObj } = obj
    return cleanObj
  }

  static removeAuditFieldsFromCollection<T extends Record<string, any>>(
    collection: T[]
  ): Omit<T, 'createdAt' | 'updatedAt' | 'deleted'>[] {
    return collection.map(item => this.removeAuditFields(item))
  }
}
