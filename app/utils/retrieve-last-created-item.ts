interface Item {
  id: number
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  status?: string
  value?: bigint | null
  militaryVehicleId: number
}

export const getLastCreatedItem = (items?: Item[]): Item | null => {
  if (!items || items.length === 0) return null

  return items.reduce((latest, item) => {
    return item.createdAt > latest.createdAt ? item : latest
  })
}
