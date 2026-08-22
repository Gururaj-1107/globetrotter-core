import { initializeApp, getApps, getApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  signOut,
  User as FirebaseUser
} from 'firebase/auth'

// Firebase Configuration — loaded ONLY from environment variables (never hardcoded)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Check if real Firebase API key is configured via env
export const isFirebaseConfigured = (): boolean => {
  return !!import.meta.env.VITE_FIREBASE_API_KEY
}

// Initialize Firebase safely (prevent duplicate initializations)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// ── Firebase Auth Helper Functions ──────────────────────────────────

export async function signInWithGoogle(): Promise<{ user: FirebaseUser; token: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    return { user: result.user, token }
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled.')
    }
    throw error
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<{ user: FirebaseUser; token: string }> {
  const result = await signInWithEmailAndPassword(auth, email, pass)
  const token = await result.user.getIdToken()
  return { user: result.user, token }
}

export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<{ user: FirebaseUser; token: string }> {
  const result = await createUserWithEmailAndPassword(auth, email, pass)
  if (displayName) {
    await updateProfile(result.user, { displayName })
  }
  const token = await result.user.getIdToken()
  return { user: result.user, token }
}

export async function getEmailProviders(email: string): Promise<string[]> {
  try {
    return await fetchSignInMethodsForEmail(auth, email)
  } catch (error) {
    console.warn('Firebase fetchSignInMethodsForEmail error:', error)
    return []
  }
}

export async function linkPasswordToGoogleUser(email: string, pass: string): Promise<FirebaseUser> {
  const currentUser = auth.currentUser
  if (!currentUser) throw new Error('No authenticated user found to link password.')
  const credential = EmailAuthProvider.credential(email, pass)
  const result = await linkWithCredential(currentUser, credential)
  return result.user
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth)
}
