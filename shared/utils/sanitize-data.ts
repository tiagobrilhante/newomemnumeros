export function sanitizeData<T extends object>(data: T): T {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? value.trim() : value,
    }),
    {} as T
  )
}

/**
 * Sanitiza string para uso em nomes de arquivos/pastas
 * Remove acentos, caracteres especiais, normaliza espaços e converte para formato seguro
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

