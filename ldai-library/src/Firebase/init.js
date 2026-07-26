import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyCQBfns_C6hjXhJArgGQi2B8j6HktiI9bA',
  authDomain: 'fit5032-lab7-ling-dai-36667145.firebaseapp.com',
  projectId: 'fit5032-lab7-ling-dai-36667145',
  storageBucket: 'fit5032-lab7-ling-dai-36667145.firebasestorage.app',
  messagingSenderId: '484123675142',
  appId: '1:484123675142:web:b34afa60b1f3038fdd5187',
  measurementId: 'G-D83ZK4DTFJ',
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith('REPLACE_WITH'),
)

export const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const db = isFirebaseConfigured
  ? initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
    })
  : null

const FIREBASE_ROLE_KEY = 'mindbridge_firebase_roles'

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback
  } catch {
    return fallback
  }
}

const loadRoles = () => safeJsonParse(localStorage.getItem(FIREBASE_ROLE_KEY), {})

export const saveFirebaseRole = (email, role) => {
  const roles = loadRoles()
  roles[String(email).toLowerCase()] = role
  localStorage.setItem(FIREBASE_ROLE_KEY, JSON.stringify(roles))
}

export const getFirebaseRole = (email) => {
  const roles = loadRoles()
  return roles[String(email ?? '').toLowerCase()] ?? 'member'
}
