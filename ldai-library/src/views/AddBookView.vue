<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import BookList from '@/components/BookList.vue'
import { db, isFirebaseConfigured } from '@/Firebase/init'

const isbn = ref('')
const name = ref('')
const bookList = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const addBook = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const isbnNumber = Number(isbn.value)
  const bookName = name.value.trim()

  if (!Number.isFinite(isbnNumber)) {
    errorMessage.value = 'ISBN must be a valid number.'
    return
  }

  if (!bookName) {
    errorMessage.value = 'Book name is required.'
    return
  }

  if (!isFirebaseConfigured || !db) {
    errorMessage.value = 'Firestore is not connected yet.'
    return
  }

  try {
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: bookName,
    })
    isbn.value = ''
    name.value = ''
    successMessage.value = 'Book added successfully.'
    await bookList.value?.fetchBooks()
  } catch (error) {
    errorMessage.value = error.code ?? error.message
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <p class="section-eyebrow">Cloud Firestore</p>
          <h1>Add Book</h1>
        </div>
        <p class="section-intro">
          Add book records to the Firestore books collection, then query, update, and delete them
          from the reusable BookList component.
        </p>
      </div>

      <div class="form-panel mb-4">
        <form class="row g-3" @submit.prevent="addBook">
          <div class="col-12 col-md-4">
            <label for="isbn" class="form-label">ISBN</label>
            <input id="isbn" v-model="isbn" type="number" class="form-control" required />
          </div>

          <div class="col-12 col-md-6">
            <label for="name" class="form-label">Name</label>
            <input id="name" v-model="name" type="text" class="form-control" required />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-end">
            <button type="submit" class="btn btn-primary w-100">Add Book</button>
          </div>
        </form>

        <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3 mb-0" role="status">
          {{ successMessage }}
        </div>
      </div>

      <BookList ref="bookList" />
    </div>
  </section>
</template>
