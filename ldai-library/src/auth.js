import { computed, ref } from 'vue'

const USERS_KEY = 'mindbridge_users'
const SESSION_KEY = 'mindbridge_session'

const demoUsers = [
  {
    id: 'demo-member',
    name: 'Maya Chen',
    email: 'member@mindbridge.org',
    password: 'Member123!',
    role: 'member',
  },
  {
    id: 'demo-staff',
    name: 'Liam Patel',
    email: 'staff@mindbridge.org',
    password: 'Staff123!',
    role: 'staff',
  },
]

const cleanText = (value) => String(value ?? '').trim()
const sanitizeText = (value) => cleanText(value).replace(/[<>]/g, '')
const normalizeEmail = (value) => cleanText(value).toLowerCase()

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback
  } catch {
    return fallback
  }
}

const loadUsers = () => {
  const storedUsers = safeJsonParse(localStorage.getItem(USERS_KEY), null)

  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    return storedUsers
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
  return demoUsers
}

const saveUsers = () => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
}

const createSession = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

const loadSession = () => {
  const session = safeJsonParse(localStorage.getItem(SESSION_KEY), null)
  return session && session.email && session.role ? session : null
}

export const users = ref(loadUsers())
export const currentUser = ref(loadSession())
export const isAuthenticated = computed(() => Boolean(currentUser.value))
export const currentRole = computed(() => currentUser.value?.role ?? 'guest')

export const registerUser = ({ name, email, password, role }) => {
  const normalizedEmail = normalizeEmail(email)
  const selectedRole = cleanText(role)

  if (users.value.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account already exists for this email address.')
  }

  const user = {
    id: `user-${Date.now()}`,
    name: sanitizeText(name),
    email: normalizedEmail,
    password,
    role: selectedRole,
  }

  users.value = [...users.value, user]
  saveUsers()

  currentUser.value = createSession(user)
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))

  return currentUser.value
}

export const loginUser = (email, password) => {
  const normalizedEmail = normalizeEmail(email)
  const user = users.value.find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === password,
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  currentUser.value = createSession(user)
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))

  return currentUser.value
}

export const logoutUser = () => {
  currentUser.value = null
  localStorage.removeItem(SESSION_KEY)
}

// Firebase Authentication is the external identity provider used by the A3 flow.
// The session object intentionally contains only display data; passwords stay in Firebase.
export const setExternalSession = ({ uid, email, role = 'member', name }) => {
  currentUser.value = {
    id: uid,
    name: sanitizeText(name || email?.split('@')[0] || 'MindBridge member'),
    email: normalizeEmail(email),
    role: role === 'staff' ? 'staff' : 'member',
    provider: 'firebase',
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
  return currentUser.value
}

export const hasRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  return roles.includes(currentUser.value?.role)
}

export const authHelpers = {
  cleanText,
  sanitizeText,
  normalizeEmail,
}
