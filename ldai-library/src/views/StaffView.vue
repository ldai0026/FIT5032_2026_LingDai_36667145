<script setup>
import { currentUser } from '../auth'
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="staff-shell">
        <p class="section-eyebrow">Staff workspace</p>
        <h1>Staff Dashboard</h1>
        <div class="account-summary my-3">
          <span class="role-badge">{{ currentUser.role }}</span>
          <p class="mb-0">Authorised staff user: {{ currentUser.name }}</p>
        </div>
        <p>
          This route is protected by role-based authorization. Staff users can prepare operational
          support summaries, resource status checks, and high-priority follow-up items.
        </p>
      </div>
    </div>
  </section>
</template>
