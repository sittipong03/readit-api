import express from "express"
import * as bookController from "../controllers/book.controller.js"


const bookRoute = express.Router()

// wishlist section 
bookRoute.get('/wishlist' , bookController.getUserShelf) // need authen check User middleware
bookRoute.post('/wishilst' , bookController.createBookToShelf) // need authen check User middleware
bookRoute.patch('/wishlist', bookController.updateBookOnShelf) // need authen check User middleware
bookRoute.delete('/wishlist/:bookId/:shelfType' , bookController.deleteBookFromShelf) // need authen check User middleware

// author section
bookRoute.get('/authors' , bookController.getAuthors)
bookRoute.post('/authors' , bookController.createAuthor) // need authen check admin middleware
bookRoute.patch('/authors/:id', bookController.updateAuthor) // need authen check admin middleware
bookRoute.delete('/authors/:id' , bookController.deleteAuthor) // need authen check admin middleware

// tags section

// Search book by AI
bookRoute.post("/search", bookController.searchBookByAI)

// tags
bookRoute.get('/tags' , bookController.getTags)
bookRoute.post('/tags' , bookController.createTag) // need authen check admin middleware
bookRoute.patch('/tags/:id', bookController.updateTag) // need authen check admin middleware
bookRoute.delete('/tags/:id' , bookController.deleteTag) // need authen check admin middleware

/// book section
bookRoute.get('/' , bookController.getBooks)
bookRoute.post('/' , bookController.createBook) // need authen check admin middleware
bookRoute.get('/search' , bookController.searchKeywordBooks)
bookRoute.get('/:id' , bookController.getBookById)
bookRoute.patch('/:id' , bookController.updateBook) // need authen check admin middleware
bookRoute.delete('/:id' , bookController.deleteBook) // need authen check admin middleware

export default bookRoute