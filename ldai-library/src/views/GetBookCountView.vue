<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref('')
const loading = ref(false)

const countBooksUrl =
  import.meta.env.VITE_COUNT_BOOKS_URL ||
  'https://fit5032-2026-lingdai-36667145.pages.dev/countBooks'

const getBookCount = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(countBooksUrl)
    count.value = response.data.count
  } catch (caughtError) {
    count.value = null
    error.value = caughtError.response?.data?.error || caughtError.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="counter-panel">
        <p class="section-eyebrow">Firebase Cloud Function</p>
        <h1>Book Counter</h1>
        <p class="text-secondary">
          Count the records currently stored in the Cloud Firestore books collection.
        </p>

        <button type="button" class="btn btn-primary" :disabled="loading" @click="getBookCount">
          {{ loading ? 'Counting...' : 'Get Book Count' }}
        </button>

        <p v-if="count !== null" class="count-result">Total number of books: {{ count }}</p>
        <div v-else-if="error" class="alert alert-danger mt-3 mb-0" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.counter-panel {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px;
  border: 1px solid var(--mindbridge-line);
  border-radius: 8px;
  background: #ffffff;
}

.count-result {
  margin: 24px 0 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--mindbridge-ink);
}
</style>
