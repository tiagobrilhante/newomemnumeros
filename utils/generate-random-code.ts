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
