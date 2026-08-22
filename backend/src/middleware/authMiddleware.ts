import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: 'USER' | 'ADMIN'
    firstName: string
    lastName: string
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_odoo_hackathon_super_secret_jwt_key_2026'

export const generateToken = (payload: { id: string; email: string; role: string; firstName: string; lastName: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' })
  }
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      req.user = decoded
    } catch (err) {
      // Ignore token error for optional auth
    }
  }
  next()
}
