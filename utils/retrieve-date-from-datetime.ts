/**
 * Extrai a data no formato DD/MM/YYYY de um Date (sem usar Intl).
 *
 * @param datetime instância de Date
 * @returns string no formato 'DD/MM/YYYY' ou '' caso algo falhe
 */
export const retrieveDate = (datetime: Date): string => {
  // Converte para ISO: "YYYY-MM-DDTHH:MM:SS.sssZ"
  const [datePart] = datetime.toString().split('T')
  if (!datePart) return ''

  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return ''

  return `${day} / ${month} /${year}`
}
