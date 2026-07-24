<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authHelpers, registerUser } from '../auth'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  form: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateName = () => {
  const name = authHelpers.cleanText(formData.value.name)

  if (!name) {
    errors.value.name = 'Full name is required.'
  } else if (name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters.'
  } else {
    errors.value.name = ''
  }
}

const validateEmail = () => {
  const email = authHelpers.normalizeEmail(formData.value.email)

  if (!email) {
    errors.value.email = 'Email is required.'
  } else if (!emailPattern.test(email)) {
    errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  const password = formData.value.password
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters.'
  } else if (!hasUppercase || !hasLowercase || !hasNumber) {
    errors.value.password = 'Password must include uppercase, lowercase, and a number.'
  } else {
    errors.value.password = ''
  }
}

const validateConfirmPassword = () => {
  errors.value.confirmPassword =
    formData.value.password === formData.value.confirmPassword ? '' : 'Passwords do not match.'
}

const validateRole = () => {
  errors.value.role = formData.value.role ? '' : 'Please select a role.'
}

const validateForm = () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateRole()

  return ['name', 'email', 'password', 'confirmPassword', 'role'].every((key) => !errors.value[key])
}

const submitRegistration = () => {
  errors.value.form = ''

  if (!validateForm()) return

  try {
    registerUser(formData.value)
    router.push('/dashboard')
  } catch (error) {
    errors.value.form = error.message
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="form-panel">
            <p class="section-eyebrow">Private account</p>
            <h1>Create a MindBridge account</h1>
            <p class="text-secondary">
              Register as a member or staff user. The selected role controls which pages the user
              can access.
            </p>

            <form class="row g-3 mt-2" @submit.prevent="submitRegistration">
              <div class="col-12 col-md-6">
                <label for="register-name" class="form-label">Full name</label>
                <input
                  id="register-name"
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  autocomplete="name"
                  @blur="validateName"
                />
                <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
              </div>

              <div class="col-12 col-md-6">
                <label for="register-email" class="form-label">Email</label>
                <input
                  id="register-email"
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  @blur="validateEmail"
                />
                <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
              </div>

              <div class="col-12 col-md-6">
                <label for="register-password" class="form-label">Password</label>
                <input
                  id="register-password"
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  @blur="validatePassword"
                />
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </div>

              <div class="col-12 col-md-6">
                <label for="register-confirm-password" class="form-label">Confirm password</label>
                <input
                  id="register-confirm-password"
                  v-model="formData.confirmPassword"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  @blur="validateConfirmPassword"
                />
                <p v-if="errors.confirmPassword" class="error-message">
                  {{ errors.confirmPassword }}
                </p>
              </div>

              <div class="col-12">
                <label for="register-role" class="form-label">Account role</label>
                <select
                  id="register-role"
                  v-model="formData.role"
                  class="form-select"
                  @blur="validateRole"
                >
                  <option disabled value="">Choose a role</option>
                  <option value="member">Member</option>
                  <option value="staff">Staff</option>
                </select>
                <p v-if="errors.role" class="error-message">{{ errors.role }}</p>
              </div>

              <div v-if="errors.form" class="col-12">
                <div class="alert alert-danger" role="alert">{{ errors.form }}</div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary">Create account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
