<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AccessDeniedView from './AccessDeniedView.vue'
import { authenticate } from '../auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const route = useRoute()
const router = useRouter()

const submitLogin = () => {
  if (authenticate(username.value, password.value)) {
    const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/about'
    router.push(destination)
  } else {
    errorMessage.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <section class="login-view py-5">
    <AccessDeniedView v-if="route.query.denied === 'true'" />

    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <h1 class="h2 text-center">Member login</h1>
        <form class="mt-4" @submit.prevent="submitLogin">
          <div class="mb-3">
            <label for="login-username" class="form-label">Username</label>
            <input id="login-username" v-model="username" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input id="login-password" v-model="password" type="password" class="form-control" />
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <button type="submit" class="btn btn-primary w-100">Log in</button>
        </form>
      </div>
    </div>
  </section>
</template>
