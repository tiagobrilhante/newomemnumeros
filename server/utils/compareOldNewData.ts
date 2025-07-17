type DataValue = string | number | boolean | null | undefined | Date | object | Array<unknown>
type DataObject = Record<string, DataValue>
type TranslationsMap = Record<string, string>

export const compareOldNewData = (
  oldData: DataObject,
  newData: DataObject,
  ignoreFields: string[],
  translations: TranslationsMap
): string[] => {
  const differences: string[] = []

  function isComplexObject(value: unknown): boolean {
    return value !== null && typeof value === 'object'
  }

  for (const key in newData) {
    // Ignora campos específicos e verifica se a propriedade existe no objeto oldData
    if (ignoreFields.includes(key) || !Object.prototype.hasOwnProperty.call(oldData, key)) {
      continue
    }

    const oldVal = oldData[key]
    const newVal = newData[key]

    // Pula arrays de objetos complexos
    if (Array.isArray(oldVal) && oldVal.some(isComplexObject)) {
      continue
    }

    // Compara valores simples
    if (oldVal !== newVal) {
      const translatedKey = translations[key] || key
      const oldDisplay = isComplexObject(oldVal) ? '[Objeto complexo]' : oldVal
      const newDisplay = isComplexObject(newVal) ? '[Objeto complexo]' : newVal

      differences.push(`${translatedKey}: de "${oldDisplay}" para "${newDisplay}"`)
    }
  }

  return differences
}
