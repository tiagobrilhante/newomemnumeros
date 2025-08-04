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

// convert datetime for pickers
export function convertForPickers(input: string): Date {
  // Supondo que a string seja algo tipo "2016-04-20 04:00:00.000"
  // Substitui o espaço entre data e hora por 'T'
  // => "2016-04-20T04:00:00.000"
  const isoLikeString = input.replace(' ', 'T')
  return new Date(isoLikeString)
}


export const retrieveMiniImage = (imagePath: string): string => {
  const cleanPath = imagePath.includes('?') ? imagePath.split('?')[0] : imagePath

  if (!cleanPath) return imagePath

  const lastDotIndex = cleanPath.lastIndexOf('.')
  if (lastDotIndex === -1) return cleanPath + '_mini'

  const pathWithoutExtension = cleanPath.substring(0, lastDotIndex)
  const extension = cleanPath.substring(lastDotIndex)
  return `${pathWithoutExtension}_mini${extension}`
}

export function sanitizeData<T extends object>(data: T): T {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? value.trim() : value,
    }),
    {} as T,
  )
}

/**
 * FOR FOLDERS OPERATIONS
 */
export function sanitizeForFilename(input: string): string {
  return input
    .trim()
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // Manter apenas letras, números, espaços, hífens e underscores
    .replace(/\s+/g, '_') // Substituir espaços por underscores
    .replace(/_{2,}/g, '_') // Múltiplos underscores consecutivos viram um só
    .replace(/^_+|_+$/g, '') // Remover underscores do início e fim
    .toLowerCase() // Converter para minúsculo (padrão de sistema de arquivos)
}

export const cleanStringToCreateFolders = (myString: string): string => {
  myString = myString.toLowerCase()
  myString = myString.replace(/\s+/g, '_') // Substitui espaços por _
  myString = myString.replace(/[^a-z0-9_]/g, '') // Remove tudo que não for a-z, 0-9 ou _
  return myString
}


export function debounce<A extends unknown[], U = unknown>(
  fn: (this: U, ...args: A) => void,
  delay: number,
): (this: U, ...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: U, ...args: A): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}


export const generateRandomCode = (): string => {
  // Contains letters (upper and lower case) and numbers
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''

  // Generate a random code with 7 characters
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters.charAt(randomIndex)
  }

  // Append the current Unix timestamp in milliseconds
  code += Date.now()
  return code
}

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


import { PERMISSION_CATEGORIES } from '#shared/constants/permissions'

export const retrievePermissionInfo = (permission: string) => {
  for (const category of PERMISSION_CATEGORIES) {
    const foundPermission = category.permissions.find((perm) => perm.slug === permission)
    if (foundPermission) {
      return {
        module: category.module,
        module_color: category.module_color,
        description: foundPermission.description,
      }
    }
  }
  return null
}
