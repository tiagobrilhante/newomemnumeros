import prisma from '~/server/prisma'
import bcrypt from 'bcrypt'

export async function registerUser(data: {
  name: string
  serviceName: string
  cpf: string
  email: string
  password: string
  rankId: string
}) {
  const { name, serviceName, cpf, email, password, rankId } = data

  if (!name || !serviceName || !email || !password || !rankId) {
    throw createError({
      statusCode: 400,
      message: 'Todos os campos são obrigatórios',
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email já cadastrado',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      serviceName,
      cpf,
      email,
      password: hashedPassword,
      rankId,
    },
  })

  return { success: true }
}
