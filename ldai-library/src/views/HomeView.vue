<script setup>
import { computed, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton',
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
})

const hasFriendInReason = computed(() => /\bfriend\b/i.test(formData.value.reason))

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.resident = 'Australian residency confirmation is required'
  } else {
    errors.value.resident = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender'
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  if (formData.value.reason.trim().length < 10) {
    if (blur) errors.value.reason = 'Reason must be at least 10 characters'
  } else {
    errors.value.reason = null
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  if (Object.values(errors.value).every((error) => !error)) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton',
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null,
  }
}
</script>

<template>
  <section class="registration-view py-4">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-10 offset-lg-1">
          <h1 class="text-center">W5. Library Registration Form</h1>
          <p class="text-center text-secondary">
            Let's build some more advanced features into our form.
          </p>

          <form class="mt-4" @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6 col-sm-6">
                <label for="username" class="form-label">Username</label>
                <input
                  id="username"
                  v-model="formData.username"
                  type="text"
                  class="form-control"
                  @blur="() => validateName(true)"
                  @input="() => validateName(false)"
                />
                <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
              </div>

              <div class="col-md-6 col-sm-6">
                <label for="gender" class="form-label">Gender</label>
                <select
                  id="gender"
                  v-model="formData.gender"
                  class="form-select"
                  @blur="() => validateGender(true)"
                  @change="() => validateGender(false)"
                >
                  <option disabled value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6 col-sm-6">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  @blur="() => validatePassword(true)"
                  @input="() => validatePassword(false)"
                />
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>

              <div class="col-md-6 col-sm-6">
                <label for="confirm-password" class="form-label">Confirm password</label>
                <input
                  id="confirm-password"
                  v-model="formData.confirmPassword"
                  type="password"
                  class="form-control"
                  @blur="() => validateConfirmPassword(true)"
                />
                <div v-if="errors.confirmPassword" class="text-danger">
                  {{ errors.confirmPassword }}
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6 col-sm-6">
                <div class="form-check">
                  <input
                    id="isAustralian"
                    v-model="formData.isAustralian"
                    type="checkbox"
                    class="form-check-input"
                    @blur="() => validateResident(true)"
                    @change="() => validateResident(false)"
                  />
                  <label class="form-check-label" for="isAustralian">Australian Resident?</label>
                  <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea
                id="reason"
                v-model="formData.reason"
                class="form-control"
                rows="3"
                @blur="() => validateReason(true)"
                @input="() => validateReason(false)"
              ></textarea>
              <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
              <div v-if="hasFriendInReason" class="text-success">Great to have a friend</div>
            </div>

            <div class="mb-3">
              <label for="suburb" class="form-label">Suburb</label>
              <input id="suburb" :value="formData.suburb" type="text" class="form-control" />
            </div>

            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
            </div>
          </form>

          <div class="mt-5">
            <h2 class="h5">This is a PrimeVue DataTable.</h2>
            <DataTable :value="submittedCards" tableStyle="table-layout: fixed; width: 100%">
              <Column field="username" header="Username"></Column>
              <Column field="password" header="Password"></Column>
              <Column header="Australian Resident">
                <template #body="{ data }">{{ data.isAustralian ? 'Yes' : 'No' }}</template>
              </Column>
              <Column field="gender" header="Gender"></Column>
              <Column field="reason" header="Reason"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
