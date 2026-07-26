<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/Firebase/init'

const books = ref([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingBookId = ref('')
const editForm = ref({
  isbn: '',
  name: '',
})

const fetchBooks = async () => {
  if (!isFirebaseConfigured || !db) {
    errorMessage.value = 'Firestore is not connected yet.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(10),
    )
    const querySnapshot = await getDocs(booksQuery)
    books.value = querySnapshot.docs.map((bookDoc) => ({
      id: bookDoc.id,
      ...bookDoc.data(),
    }))
  } catch (error) {
    errorMessage.value = error.code ?? error.message
  } finally {
    loading.value = false
  }
}

const startEdit = (book) => {
  editingBookId.value = book.id
  editForm.value = {
    isbn: String(book.isbn),
    name: book.name,
  }
  successMessage.value = ''
  errorMessage.value = ''
}

const cancelEdit = () => {
  editingBookId.value = ''
  editForm.value = {
    isbn: '',
    name: '',
  }
}

const updateBook = async (bookId) => {
  const isbnNumber = Number(editForm.value.isbn)
  const bookName = editForm.value.name.trim()

  if (!Number.isFinite(isbnNumber) || !bookName) {
    errorMessage.value = 'ISBN must be a valid number and name is required.'
    return
  }

  try {
    await updateDoc(doc(db, 'books', bookId), {
      isbn: isbnNumber,
      name: bookName,
    })
    successMessage.value = 'Book updated successfully.'
    cancelEdit()
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.code ?? error.message
  }
}

const deleteBook = async (bookId) => {
  try {
    await deleteDoc(doc(db, 'books', bookId))
    successMessage.value = 'Book deleted successfully.'
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.code ?? error.message
  }
}

onMounted(fetchBooks)

defineExpose({
  fetchBooks,
})
</script>

<template>
  <section class="book-list-panel">
    <div class="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
      <div>
        <p class="section-eyebrow mb-1">Firestore query</p>
        <h2>Books with ISBN &gt; 1000</h2>
      </div>
      <button type="button" class="btn btn-outline-primary align-self-start" @click="fetchBooks">
        Refresh
      </button>
    </div>

    <p class="small text-secondary">
      Query uses collection(db, 'books'), where('isbn', '&gt;', 1000), orderBy('isbn', 'asc'),
      and limit(10).
    </p>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</div>
    <p v-if="loading" class="text-secondary">Loading books from Firestore...</p>

    <div v-if="!loading && books.length === 0" class="empty-state">
      No Firestore books match ISBN &gt; 1000 yet.
    </div>

    <div v-else class="list-group">
      <article v-for="book in books" :key="book.id" class="list-group-item">
        <div v-if="editingBookId === book.id" class="row g-2 align-items-end">
          <div class="col-12 col-md-3">
            <label :for="`edit-isbn-${book.id}`" class="form-label">ISBN</label>
            <input
              :id="`edit-isbn-${book.id}`"
              v-model="editForm.isbn"
              type="number"
              class="form-control"
              required
            />
          </div>
          <div class="col-12 col-md-5">
            <label :for="`edit-name-${book.id}`" class="form-label">Name</label>
            <input
              :id="`edit-name-${book.id}`"
              v-model="editForm.name"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-12 col-md-4 d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-primary" @click="updateBook(book.id)">
              Save update
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">
              Cancel
            </button>
          </div>
        </div>

        <div v-else class="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <h3>{{ book.name }}</h3>
            <p class="mb-0 text-secondary">ISBN: {{ book.isbn }}</p>
            <p class="mb-0 small text-secondary">Document ID: {{ book.id }}</p>
          </div>
          <div class="d-flex align-items-start gap-2">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="startEdit(book)">
              Edit
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteBook(book.id)">
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
