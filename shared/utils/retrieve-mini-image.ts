export const retrieveMiniImage = (imagePath: string): string => {
  const lastDotIndex = imagePath.lastIndexOf('.')
  const pathWithoutExtension = imagePath.substring(0, lastDotIndex)
  const extension = imagePath.substring(lastDotIndex)
  return `${pathWithoutExtension}_mini${extension}`
}
