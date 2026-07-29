<script setup>
import { onMounted, ref } from 'vue'
import authorsData from '../assets/json/authors.json'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const getApiData = async () => {
  loading.value = true
  error.value = null

  try {
    authors.value = authorsData
    const totalBooks = authors.value.reduce((total, author) => {
      return total + author.famousWorks.length
    }, 0)

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authors.value.length,
        totalBooks,
        authors: authors.value.map((author) => ({
          name: author.name,
          bookCount: author.famousWorks.length,
        })),
      },
      timestamp: new Date().toISOString(),
    }
  } catch (caughtError) {
    error.value = `Error loading authors data: ${caughtError.message}`
    console.error('Error loading authors data:', caughtError)
  } finally {
    loading.value = false
  }
}

onMounted(getApiData)

defineExpose({
  getApiData,
})
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="api-shell">
        <p class="section-eyebrow">Local API response</p>
        <h1 class="api-title">Count Book API</h1>
        <p v-if="loading">Loading authors data...</p>
        <p v-else-if="error" class="error-message">{{ error }}</p>
        <div v-else-if="apiResponse" class="api-response">
          <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.api-shell {
  max-width: 900px;
  margin: 0 auto;
}

.api-title {
  margin-bottom: 24px;
  font-size: 2.4rem;
}

.api-response {
  overflow-x: auto;
  padding: 24px;
  border: 1px solid var(--mindbridge-line);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(23, 32, 51, 0.07);
}

pre {
  margin: 0;
  color: var(--mindbridge-ink);
  white-space: pre-wrap;
}
</style>
