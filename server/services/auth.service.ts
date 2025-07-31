import prisma from '../prisma'
import bcrypt from 'bcrypt'
import { createError } from 'h3'
import { UserTransformer } from '../transformers/user.transformer'

export async function authenticateUser(email: string, password: string) {
  console.log('no service')
  console.log(email, password)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios',
    })
  }

  const user = await prisma.user.findUnique({
    where: { email, deleted: false },
    include: {
      rank: true,
      role: {
        include: {
          militaryOrganization: true,
          permissions: {
            include: {
              permission: true
            }
          },
        },
      },
      section: {
        include: {
          militaryOrganization: true
        }
      },
    },
  })

  console.log('resultado de user service')
  console.log(user)
  console.log('resultado de user service')

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Credenciais inválidas',
    })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: 'Credenciais inválidas',
    })
  }

  // Usar método otimizado para autenticação
  return UserTransformer.transformForAuth(user)
}
