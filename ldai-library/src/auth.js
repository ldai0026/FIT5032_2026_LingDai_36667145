import { ref } from 'vue'

export const isAuthenticated = ref(false)

export const authenticate = (username, password) => {
  const isValid = username === 'member' && password === 'library123'
  isAuthenticated.value = isValid
  return isValid
}

export const logout = () => {
  isAuthenticated.value = false
}
