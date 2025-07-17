interface Item {
  id: number
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  status?: string
  value?: bigint | null
  militaryVehicleId: number
}

export const getFirstCreatedItem = (items?: Item[]): Item | null => {
  if (!items || items.length === 0) return null

  return items.reduce((first, item) => {
    return item.createdAt > first.createdAt ? item : first
  })
}
