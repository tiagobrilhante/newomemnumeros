import jwt from 'jsonwebtoken'
import type { Secret, JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

interface CustomPayload extends JwtPayload {
  userId: string | unknown
}

export function generateJwtToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const payload: CustomPayload = {
    userId,
  }

  return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

