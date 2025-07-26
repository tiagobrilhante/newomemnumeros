export function convertForPickers(input: string): Date {
  // Supondo que a string seja algo tipo "2016-04-20 04:00:00.000"
  // Substitui o espaço entre data e hora por 'T'
  // => "2016-04-20T04:00:00.000"
  const isoLikeString = input.replace(' ', 'T')
  return new Date(isoLikeString)
}
