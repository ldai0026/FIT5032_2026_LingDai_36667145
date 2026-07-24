<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, hasRole, isAuthenticated, logoutUser } from '../auth'

const router = useRouter()
const canSeeStaff = computed(() => hasRole('staff'))

const handleLogout = () => {
  logoutUser()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div class="container py-2">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <span class="brand-mark">MB</span>
        <span>MindBridge</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mindbridgeNav"
        aria-controls="mindbridgeNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mindbridgeNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/resources" class="nav-link" active-class="active">
              Resources
            </router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              Dashboard
            </router-link>
          </li>
          <li v-if="canSeeStaff" class="nav-item">
            <router-link to="/staff" class="nav-link" active-class="active">Staff</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <span class="nav-link disabled">
              {{ currentUser.name }} · {{ currentUser.role }}
            </span>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/register" class="btn btn-primary btn-sm ms-lg-2">Register</router-link>
          </li>
          <li v-else class="nav-item">
            <button type="button" class="btn btn-outline-primary btn-sm ms-lg-2" @click="handleLogout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
