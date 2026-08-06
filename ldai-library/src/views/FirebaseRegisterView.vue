<script setup>
import { computed, ref } from 'vue'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { firebaseApp, isFirebaseConfigured, saveFirebaseRole } from '@/firebase'
import { setExternalSession } from '@/auth'

const formData = ref({
  email: '',
  password: '',
  role: 'member',
})

const errors = ref({
  email: '',
  password: '',
  form: '',
})

const successMessage = ref('')
const createdUser = ref(null)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const trimmedEmail = computed(() => formData.value.email.trim().toLowerCase())

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
  if (!formData.value.password) {
    errors.value.password = 'Password is required.'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Firebase password must be at least 6 characters.'
  } else {
    errors.value.password = ''
  }
}

const validateForm = () => {
  validateEmail()
  validatePassword()
  return !errors.value.email && !errors.value.password
}

const registerFirebaseUser = async () => {
  errors.value.form = ''
  successMessage.value = ''
  createdUser.value = null

  if (!validateForm()) return

  if (!isFirebaseConfigured) {
    errors.value.form = 'Firebase configuration is not connected yet.'
    return
  }

  try {
    const auth = getAuth(firebaseApp)
    const credential = await createUserWithEmailAndPassword(
      auth,
      trimmedEmail.value,
      formData.value.password,
    )

    saveFirebaseRole(credential.user.email, formData.value.role)
    setExternalSession({ uid: credential.user.uid, email: credential.user.email, role: formData.value.role })
    createdUser.value = credential.user
    successMessage.value = `Registered ${credential.user.email} as ${formData.value.role}.`
    console.log(
      `Firebase registered user: ${credential.user.email} (${credential.user.uid})`,
    )
  } catch (error) {
    errors.value.form = error.code ?? error.message
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="form-panel">
            <p class="section-eyebrow">Firebase authentication</p>
            <h1>FireRegister</h1>
            <p class="text-secondary">
              Register a Firebase Authentication user and store the selected MindBridge role for
              the role sign-in test.
            </p>

            <div v-if="!isFirebaseConfigured" class="alert alert-warning" role="alert">
              Firebase web app configuration still needs to be copied from the Firebase console.
            </div>

            <form class="row g-3 mt-2" @submit.prevent="registerFirebaseUser">
              <div class="col-12 col-md-6">
                <label for="firebase-register-email" class="form-label">Email</label>
                <input
                  id="firebase-register-email"
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  @blur="validateEmail"
                />
                <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
              </div>

              <div class="col-12 col-md-6">
                <label for="firebase-register-password" class="form-label">Password</label>
                <input
                  id="firebase-register-password"
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  @blur="validatePassword"
                />
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </div>

              <div class="col-12">
                <label for="firebase-register-role" class="form-label">Role</label>
                <select id="firebase-register-role" v-model="formData.role" class="form-select">
                  <option value="member">Member</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div v-if="errors.form" class="col-12">
                <div class="alert alert-danger" role="alert">{{ errors.form }}</div>
              </div>

              <div v-if="successMessage" class="col-12">
                <div class="alert alert-success" role="alert">
                  {{ successMessage }}
                  <span v-if="createdUser">UID: {{ createdUser.uid }}</span>
                </div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary">Register with Firebase</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
