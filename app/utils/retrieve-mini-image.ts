export const retrieveMiniImage = (imagePath: string): string => {
  // Separa o nome do arquivo da extensão.
  const lastDotIndex = imagePath.lastIndexOf('.')
  const pathWithoutExtension = imagePath.substring(0, lastDotIndex)
  const extension = imagePath.substring(lastDotIndex)

  // Retorna o caminho com "_mini" antes da extensão.
  return `${pathWithoutExtension}_mini${extension}`
}
