export function getRandomColor(): string {
  const minValue = 40
  const maxValue = 215
  const range = maxValue - minValue

  const r = Math.floor(Math.random() * range) + minValue
  const g = Math.floor(Math.random() * range) + minValue
  const b = Math.floor(Math.random() * range) + minValue

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function getColorOrRandom(color: string | null): string {
  return color?.trim() || getRandomColor()
}
