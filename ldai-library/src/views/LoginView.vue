<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginUser } from '../auth'

const route = useRoute()
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
})

const errors = ref({
  email: '',
  password: '',
  form: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = () => {
  const email = formData.value.email.trim()

  if (!email) {
    errors.value.email = 'Email is required.'
  } else if (!emailPattern.test(email)) {
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

const submitLogin = () => {
  errors.value.form = ''

  if (!validateForm()) return

  try {
    loginUser(formData.value.email, formData.value.password)
    const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(destination)
  } catch (error) {
    errors.value.form = error.message
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="form-panel">
            <p class="section-eyebrow">Account access</p>
            <h1>Login</h1>
            <p class="text-secondary">
              Sign in with a registered MindBridge account. Demo accounts are available for A2
              testing.
            </p>

            <div v-if="route.query.denied === 'true'" class="alert alert-warning" role="alert">
              Please log in before opening that page.
            </div>

            <div class="demo-credentials">
              <p><strong>Member:</strong> member@mindbridge.org / Member123!</p>
              <p><strong>Staff:</strong> staff@mindbridge.org / Staff123!</p>
            </div>

            <form class="mt-4" @submit.prevent="submitLogin">
              <div class="mb-3">
                <label for="login-email" class="form-label">Email</label>
                <input
                  id="login-email"
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  @blur="validateEmail"
                />
                <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
              </div>

              <div class="mb-3">
                <label for="login-password" class="form-label">Password</label>
                <input
                  id="login-password"
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                  @blur="validatePassword"
                />
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </div>

              <div v-if="errors.form" class="alert alert-danger" role="alert">
                {{ errors.form }}
              </div>

              <button type="submit" class="btn btn-primary w-100">Login</button>
              <router-link to="/firebase-signin" class="btn btn-outline-primary w-100 mt-2">Use external Firebase authentication</router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
