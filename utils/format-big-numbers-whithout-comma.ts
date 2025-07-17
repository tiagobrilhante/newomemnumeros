export const formatNumber = (value: string | number | bigint | undefined) => {
  if (value === 'N/A') return 'N/A'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return 'N/A'
}
