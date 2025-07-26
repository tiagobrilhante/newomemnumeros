import prisma from '../prisma'
import bcrypt from 'bcrypt'
import { cpf } from 'cpf-cnpj-validator'
import { handleError } from '../utils/errorHandler'

function sanitizeCPF(value: string): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

export async function registerUser(
  data: {
    name: string
    serviceName: string
    cpf: string
    email: string
    password: string
    rankId: string
  },
  locale: string,
) {
  try {
    const { name, serviceName, cpf: rawCpf, email, password, rankId } = data

    if (!name || !serviceName || !email || !password || !rankId || !rawCpf) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.allFieldsRequired'),
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.emailAlreadyExists'),
      })
    }

    const sanitizedCPF = sanitizeCPF(rawCpf)

    if (!cpf.isValid(sanitizedCPF)) {
      return createError({
        statusCode: 400,
        message: await serverTByLocale(locale, 'errors.cpfInvalid'),
      })
    }

    const existingCpf = await prisma.user.findUnique({
      where: { cpf: sanitizedCPF },
    })

    if (existingCpf) {
      return createError({
        statusCode: 409,
        message: await serverTByLocale(locale, 'errors.cpfAlreadyExists'),
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        serviceName,
        cpf: sanitizedCPF,
        email,
        password: hashedPassword,
        rankId,
      },
    })

    return {
      success: true,
      statusCode: 201,
      message: await serverTByLocale(locale, 'success.userRegistered'),
    }
  } catch (error) {
    throw await handleError(error, locale)
  }
}
