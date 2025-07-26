export const cleanStringToCreateFolders = (myString: string): string => {
  myString = myString.toLowerCase()
  myString = myString.replace(/\s+/g, '_') // Substitui espaços por _
  myString = myString.replace(/[^a-z0-9_]/g, '') // Remove tudo que não for a-z, 0-9 ou _
  return myString
}
