<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { firebaseApp, getFirebaseRole, isFirebaseConfigured } from '@/firebase'

const formData = ref({
  email: '',
  password: '',
})

const errors = ref({
  email: '',
  password: '',
  form: '',
})

const statusMessage = ref('')
const currentFirebaseUser = ref(null)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const trimmedEmail = computed(() => formData.value.email.trim().toLowerCase())
const currentRole = computed(() => getFirebaseRole(currentFirebaseUser.value?.email))

let unsubscribeAuth = null

const getFirebaseAuth = () => (isFirebaseConfigured ? getAuth(firebaseApp) : null)

const validateEmail = () => {
  if (!trimmedEmail.value) {
    errors.value.email = 'Email is required.'
  } else if (!emailPattern.test(trimmedEmail.value)) {
    errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  errors.value.password = formData.value.password ? '' : 'Password is required.'
}

const validateForm = () => {
  validateEmail()
  validatePassword()
  return !errors.value.email && !errors.value.password
}

const signInFirebaseUser = async () => {
  errors.value.form = ''
  statusMessage.value = ''

  if (!validateForm()) return

  const auth = getFirebaseAuth()
  if (!auth) {
    errors.value.form = 'Firebase configuration is not connected yet.'
    return
  }

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      trimmedEmail.value,
      formData.value.password,
    )
    currentFirebaseUser.value = credential.user
    statusMessage.value = `Signed in as ${credential.user.email}.`
    console.log(`Current Firebase user: ${credential.user.email} (${credential.user.uid})`)
  } catch (error) {
    errors.value.form = error.code ?? error.message
  }
}

const logoutFirebaseUser = async () => {
  const auth = getFirebaseAuth()
  if (!auth) return

  await signOut(auth)
  currentFirebaseUser.value = null
  statusMessage.value = 'Signed out. Current Firebase user is null.'
  console.log('Current Firebase user after logout: null')
}

onMounted(() => {
  const auth = getFirebaseAuth()
  if (!auth) return

  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentFirebaseUser.value = user
    console.log(user ? `Current Firebase user: ${user.email} (${user.uid})` : 'Current Firebase user: null')
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="form-panel">
            <p class="section-eyebrow">Firebase authentication</p>
            <h1>Firebase Sign In</h1>
            <p class="text-secondary">
              Sign in with a Firebase Authentication user. The console panel logs the current user
              for the Lab 7 evidence screenshots.
            </p>

            <div v-if="!isFirebaseConfigured" class="alert alert-warning" role="alert">
              Firebase web app configuration still needs to be copied from the Firebase console.
            </div>

            <form class="row g-3 mt-2" @submit.prevent="signInFirebaseUser">
              <div class="col-12 col-md-6">
                <label for="firebase-signin-email" class="form-label">Email</label>
                <input
                  id="firebase-signin-email"
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  @blur="validateEmail"
                />
                <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
              </div>

              <div class="col-12 col-md-6">
                <label for="firebase-signin-password" class="form-label">Password</label>
                <input
                  id="firebase-signin-password"
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                  @blur="validatePassword"
                />
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </div>

              <div v-if="errors.form" class="col-12">
                <div class="alert alert-danger" role="alert">{{ errors.form }}</div>
              </div>

              <div v-if="statusMessage" class="col-12">
                <div class="alert alert-info" role="status">{{ statusMessage }}</div>
              </div>

              <div class="col-12 d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-primary">Sign in with Firebase</button>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  :disabled="!currentFirebaseUser"
                  @click="logoutFirebaseUser"
                >
                  Log out
                </button>
              </div>
            </form>

            <div v-if="currentFirebaseUser" class="account-summary mt-4">
              <span class="role-badge">{{ currentRole }}</span>
              <p class="mb-0">
                Current user: <strong>{{ currentFirebaseUser.email }}</strong>
              </p>
              <p class="mb-0 small text-secondary">UID: {{ currentFirebaseUser.uid }}</p>
            </div>

            <div class="demo-credentials">
              <p><strong>Multiple-role check:</strong> register one Member user and one Staff user.</p>
              <p>After sign-in, this page displays the role stored for that Firebase email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
