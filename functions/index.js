const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

exports.countBooks = onRequest({ region: 'us-central1' }, (req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection('books')
      const snapshot = await booksCollection.get()
      const count = snapshot.size

      res.status(200).send({ count })
    } catch (error) {
      console.error('Error counting books:', error.message)
      res.status(500).send({ error: 'Error counting books' })
    }
  })
})

exports.bookShowcase = onRequest({ region: 'us-central1' }, (req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection('books').orderBy('name').limit(12).get()
      const books = snapshot.docs.map((bookDocument) => {
        const book = bookDocument.data()
        return {
          id: bookDocument.id,
          isbn: book.isbn,
          name: book.name,
        }
      })

      res.status(200).send({
        title: 'MindBridge Book Showcase',
        message: 'A curated catalogue generated from Cloud Firestore.',
        total: books.length,
        books,
      })
    } catch (error) {
      console.error('Error creating book showcase:', error.message)
      res.status(500).send({ error: 'Error loading the book showcase' })
    }
  })
})
