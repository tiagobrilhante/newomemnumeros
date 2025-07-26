export const formatedDatetime = (datetime: Date, withHours: boolean = true) => {
  const date = new Date(datetime)

  const options: Intl.DateTimeFormatOptions = withHours
    ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    : {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }

  return date.toLocaleString('pt-BR', options)
}
