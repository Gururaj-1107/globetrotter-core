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

// Firebase Configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBsUipBkKSw3TZTvIUiz4v714z-yZiL-X4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "globetrotter-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "globetrotter-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "globetrotter-auth.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "641276435438",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:641276435438:web:0642553756f7b4cf19ccff"
}

// Check if real Firebase API key is configured
export const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey
  return !!apiKey && !apiKey.includes('Dummy')
}

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// ── Firebase Auth Helper Functions ──────────────────────────────────

/**
 * 1. Real Google Sign-In with Popup
 */
export async function signInWithGoogle(): Promise<{ user: FirebaseUser; token: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    return { user: result.user, token }
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled.')
    }
    if (error.code === 'auth/unauthorized-domain') {
      console.warn('Domain not authorized in Firebase Console (add localhost in Firebase Auth settings).')
    }
    throw error
  }
}

/**
 * 2. Real Email & Password Login
 */
export async function loginWithEmail(email: string, pass: string): Promise<{ user: FirebaseUser; token: string }> {
  const result = await signInWithEmailAndPassword(auth, email, pass)
  const token = await result.user.getIdToken()
  return { user: result.user, token }
}

/**
 * 3. Real Email & Password Registration
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<{ user: FirebaseUser; token: string }> {
  const result = await createUserWithEmailAndPassword(auth, email, pass)
  if (displayName) {
    await updateProfile(result.user, { displayName })
  }
  const token = await result.user.getIdToken()
  return { user: result.user, token }
}

/**
 * 4. Check Provider Methods for an Email (The Requested Edge Case)
 */
export async function getEmailProviders(email: string): Promise<string[]> {
  try {
    return await fetchSignInMethodsForEmail(auth, email)
  } catch (error) {
    console.warn('Firebase fetchSignInMethodsForEmail error, using backend provider check:', error)
    return []
  }
}

/**
 * 5. Link Email/Password credential to the current Google user (Same Firebase UID)
 */
export async function linkPasswordToGoogleUser(email: string, pass: string): Promise<FirebaseUser> {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No authenticated user found to link password.')
  }

  const credential = EmailAuthProvider.credential(email, pass)
  const result = await linkWithCredential(currentUser, credential)
  return result.user
}

/**
 * 6. Sign Out
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth)
}
