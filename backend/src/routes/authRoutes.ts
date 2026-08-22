import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { generateToken, authenticateToken, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

// In-memory / DB User store
export interface UserRecord {
  id: string
  email: string
  passwordHash?: string
  authProvider: 'EMAIL_PASSWORD' | 'GOOGLE' | 'BOTH'
  googleId?: string
  firstName: string
  lastName: string
  phoneNumber?: string
  city?: string
  country?: string
  avatarUrl?: string
  bio?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

// Initial demo users
export let USERS: UserRecord[] = [
  {
    id: 'usr-demo-wanderer',
    email: 'traveler@globetrotter.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    authProvider: 'EMAIL_PASSWORD',
    firstName: 'Alex',
    lastName: 'Rivers',
    phoneNumber: '+1 555-019-2834',
    city: 'San Francisco',
    country: 'USA',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Passionate globetrotter, mountain hiker, and cultural explorer seeking authentic local experiences.',
    role: 'USER',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-demo-admin',
    email: 'admin@globetrotter.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    authProvider: 'EMAIL_PASSWORD',
    firstName: 'Clara',
    lastName: 'Martin',
    phoneNumber: '+1 555-432-8765',
    city: 'London',
    country: 'UK',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'GlobeTrotter Lead Operations & City Curator.',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-google-demo',
    email: 'rahul@gmail.com',
    authProvider: 'GOOGLE',
    googleId: 'google-oauth-1092837461',
    firstName: 'Rahul',
    lastName: 'Sharma',
    phoneNumber: '+91 98765 43210',
    city: 'Mumbai',
    country: 'India',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Exploring Asia and Europe one city at a time.',
    role: 'USER',
    createdAt: new Date().toISOString()
  }
]

// 1. Check Auth Provider for an email (Edge Case Step 1)
router.post('/check-provider', (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    return res.json({
      exists: false,
      provider: null,
      message: 'Account not found. You can sign up.'
    })
  }

  if (user.authProvider === 'GOOGLE') {
    return res.json({
      exists: true,
      provider: 'GOOGLE',
      hasPassword: false,
      message: 'This account was created using Google Sign-In.',
      actionRequired: 'CONTINUE_WITH_GOOGLE',
      user: {
        email: user.email,
        firstName: user.firstName,
        avatarUrl: user.avatarUrl
      }
    })
  }

  return res.json({
    exists: true,
    provider: user.authProvider,
    hasPassword: true,
    actionRequired: 'ENTER_PASSWORD'
  })
})

// 2. Google Authentication (Login or Auto-Signup)
router.post('/google-auth', async (req: Request, res: Response) => {
  const { email, googleId, firstName, lastName, avatarUrl } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required for Google Sign-In' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  let user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    // First-time Google user sign up
    user = {
      id: `usr-g-${Date.now()}`,
      email: normalizedEmail,
      googleId: googleId || `google-${Date.now()}`,
      authProvider: 'GOOGLE',
      firstName: firstName || email.split('@')[0],
      lastName: lastName || '',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'GlobeTrotter explorer signed up with Google.',
      role: 'USER',
      createdAt: new Date().toISOString()
    }
    USERS.push(user)
  } else if (!user.googleId) {
    // User signed up previously with password, now linking Google
    user.googleId = googleId || `google-${Date.now()}`
    user.authProvider = 'BOTH'
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  })

  return res.json({
    message: 'Google authentication successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider,
      needsPasswordSetup: user.authProvider === 'GOOGLE' && !user.passwordHash
    }
  })
})

// 3. Link Password to an existing Google account (Edge Case Step 2)
router.post('/link-password', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { password, confirmPassword } = req.body
  const userId = req.user?.id

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  const user = USERS.find(u => u.id === userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  user.passwordHash = await bcrypt.hash(password, 10)
  user.authProvider = 'BOTH'

  return res.json({
    success: true,
    message: 'Password successfully created and linked to your account. You can now sign in using both Google and Email + Password.',
    user: {
      id: user.id,
      email: user.email,
      authProvider: user.authProvider
    }
  })
})

// 4. Standard Email + Password Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  // Edge case: If user registered strictly with Google and hasn't set a password
  if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
    return res.status(400).json({
      error: 'This account was created using Google Sign-In. Please sign in with Google.',
      code: 'GOOGLE_SIGN_IN_ONLY',
      provider: 'GOOGLE'
    })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash || '')
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  })

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider
    }
  })
})

// 5. User Registration (All Wireframe Fields)
router.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone, city, country, bio, avatarUrl } = req.body

  if (!email || !password || !firstName) {
    return res.status(400).json({ error: 'First name, email, and password are required' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existing = USERS.find(u => u.email.toLowerCase() === normalizedEmail)
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    email: normalizedEmail,
    passwordHash,
    authProvider: 'EMAIL_PASSWORD',
    firstName: firstName.trim(),
    lastName: (lastName || '').trim(),
    phoneNumber: phone || '',
    city: city || '',
    country: country || '',
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: bio || '',
    role: 'USER',
    createdAt: new Date().toISOString()
  }

  USERS.push(newUser)

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  })

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      city: newUser.city,
      country: newUser.country,
      avatarUrl: newUser.avatarUrl,
      bio: newUser.bio,
      role: newUser.role,
      authProvider: newUser.authProvider
    }
  })
})

// 6. Get Current User Profile (Me)
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = USERS.find(u => u.id === req.user?.id)
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' })
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider
    }
  })
})

// 7. Update Profile
router.put('/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = USERS.find(u => u.id === req.user?.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { firstName, lastName, phoneNumber, city, country, bio, avatarUrl } = req.body
  if (firstName) user.firstName = firstName
  if (lastName !== undefined) user.lastName = lastName
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber
  if (city !== undefined) user.city = city
  if (country !== undefined) user.country = country
  if (bio !== undefined) user.bio = bio
  if (avatarUrl) user.avatarUrl = avatarUrl

  return res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider
    }
  })
})

export default router
