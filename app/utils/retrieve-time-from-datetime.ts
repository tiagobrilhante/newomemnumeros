/**
 * Extrai a parte de hora e minuto de uma string ISO (YYYY-MM-DDTHH:MM:SS.sssZ),
 * sem usar Date.
 *
 * @param datetime ISO string no formato 'YYYY-MM-DDTHH:MM:SS...'
 * @returns string no formato 'HH:MM' ou '' caso não consiga extrair
 */
export const retrieveTime = (datetime: Date): string => {
  const [, time] = datetime.toString().split('T')
  if (!time) return ''

  const [hour, minute] = time.split(':')
  if (!hour || !minute) return ''

  return `${hour}:${minute}`
}
