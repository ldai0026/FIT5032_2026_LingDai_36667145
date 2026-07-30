import { jsonResponse, readBooks } from './_shared/books.js'

export const onRequestGet = async () => {
  try {
    const books = await readBooks()
    const sortedBooks = books
      .filter((book) => book.name)
      .sort((firstBook, secondBook) => firstBook.name.localeCompare(secondBook.name))
      .slice(0, 12)

    return jsonResponse({
      title: 'MindBridge Book Showcase',
      message: 'A curated catalogue generated from Cloud Firestore.',
      total: sortedBooks.length,
      books: sortedBooks,
    })
  } catch (error) {
    return jsonResponse({ error: error.message }, 500)
  }
}
