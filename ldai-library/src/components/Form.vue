<script setup>
import { computed, reactive, ref } from 'vue'

const formData = reactive({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: 'Female',
})

const submittedData = ref(null)

const passwordHelp = computed(() => {
  if (!formData.password) return 'Use a private password for your library account.'
  return formData.password.length >= 8
    ? 'Password length looks good.'
    : 'Password should be at least 8 characters.'
})

function submitForm() {
  submittedData.value = {
    username: formData.username,
    password: formData.password,
    isAustralian: formData.isAustralian,
    reason: formData.reason,
    gender: formData.gender,
  }
}

function resetForm() {
  formData.username = ''
  formData.password = ''
  formData.isAustralian = false
  formData.reason = ''
  formData.gender = 'Female'
  submittedData.value = null
}
</script>

<template>
  <main class="container py-4 py-md-5">
    <section class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7">
        <h1>User Information Form / Credentials</h1>

        <form class="library-form needs-validation" @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="username" class="form-label">Username:</label>
              <input
                id="username"
                v-model.trim="formData.username"
                class="form-control"
                type="text"
                placeholder="Enter username"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="password" class="form-label">Password:</label>
              <input
                id="password"
                v-model="formData.password"
                class="form-control"
                type="password"
                placeholder="Enter password"
                minlength="8"
                required
              />
              <div class="form-text">{{ passwordHelp }}</div>
            </div>

            <div class="col-12">
              <div class="form-check">
                <input
                  id="resident"
                  v-model="formData.isAustralian"
                  class="form-check-input"
                  type="checkbox"
                />
                <label for="resident" class="form-check-label">Australian Resident?</label>
              </div>
            </div>

            <div class="col-12">
              <label for="reason" class="form-label">Reason For Joining:</label>
              <textarea
                id="reason"
                v-model.trim="formData.reason"
                class="form-control"
                rows="4"
                placeholder="Tell us why you are joining the library."
              ></textarea>
            </div>

            <div class="col-12 col-sm-8 col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select id="gender" v-model="formData.gender" class="form-select">
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div class="col-12 d-grid d-sm-flex gap-2 pt-2">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" class="btn btn-outline-secondary" @click="resetForm">Reset</button>
            </div>
          </div>
        </form>

        <section v-if="submittedData" class="submitted-card mt-4">
          <h2>Submitted User Information</h2>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <p><strong>Username:</strong> {{ submittedData.username }}</p>
              <p><strong>Password:</strong> {{ submittedData.password }}</p>
              <p><strong>Australian Resident:</strong> {{ submittedData.isAustralian ? 'Yes' : 'No' }}</p>
            </div>
            <div class="col-12 col-md-6">
              <p><strong>Gender:</strong> {{ submittedData.gender }}</p>
              <p><strong>Reason For Joining:</strong> {{ submittedData.reason || 'No reason entered' }}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
