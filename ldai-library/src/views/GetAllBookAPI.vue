<script setup>
import { onMounted, ref } from 'vue'
import authorsData from '../assets/json/authors.json'

const apiResponse = ref(null)

const getAllBooks = () => {
  const books = authorsData.flatMap((author) =>
    author.famousWorks.map((title) => ({
      title,
      author: author.name,
      genre: author.genre,
    })),
  )

  apiResponse.value = {
    success: true,
    data: {
      totalBooks: books.length,
      books,
    },
    timestamp: new Date().toISOString(),
  }
}

onMounted(getAllBooks)
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="api-shell">
        <p class="section-eyebrow">Local API response</p>
        <h1 class="api-title">Get All Book API</h1>
        <div v-if="apiResponse" class="api-response">
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
