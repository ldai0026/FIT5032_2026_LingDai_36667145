import { jsonResponse, readBooks } from './_shared/books.js'

export const onRequestGet = async () => {
  try {
    const books = await readBooks()
    return jsonResponse({ count: books.length })
  } catch (error) {
    return jsonResponse({ error: error.message }, 500)
  }
}
