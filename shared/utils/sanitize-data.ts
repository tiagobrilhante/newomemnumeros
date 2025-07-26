export function sanitizeData<T extends object>(data: T): T {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? value.trim() : value,
    }),
    {} as T
  )
}
