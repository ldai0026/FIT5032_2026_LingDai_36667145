<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <BHeader />

    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f6f8fb;
}
</style>
