import express from "express";
import * as bookController from "../controllers/book.controller.js";
import uploadPic from "../middleware/upload-pic.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const bookRoute = express.Router();

// wishlist section
bookRoute.get("/wishlist", authMiddleware, bookController.getUserShelf);
bookRoute.post("/wishlist", authMiddleware, bookController.createBookToShelf);
bookRoute.patch("/wishlist", authMiddleware, bookController.updateBookOnShelf);
bookRoute.delete(
  "/wishlist/:bookId/:shelfType",
  authMiddleware,
  bookController.deleteBookFromShelf
);

// author section
bookRoute.get("/authors", bookController.getAuthors);
bookRoute.post("/authors", bookController.createAuthor); // need authen check admin middleware
bookRoute.patch("/authors/:id", bookController.updateAuthor); // need authen check admin middleware
bookRoute.delete("/authors/:id", bookController.deleteAuthor); // need authen check admin middleware

// tags section
bookRoute.get("/has-tags", authMiddleware, bookController.checkUserHasTags);
bookRoute.post("/submit-tags", authMiddleware, bookController.submitTags);

// Search book by AI
// bookRoute.post("/search", bookController.searchBookByAI)
bookRoute.post("/searchAI", bookController.searchBookByAI); //Search book by AI

// tags
bookRoute.get("/tags", authMiddleware, bookController.getTags);
bookRoute.post("/tags", authMiddleware, bookController.createTag); // need authen check admin middleware
bookRoute.patch("/tags/:id", authMiddleware, bookController.updateTag); // need authen check admin middleware
bookRoute.delete("/tags/:id", authMiddleware, bookController.deleteTag); // need authen check admin middleware

// Id
bookRoute.get("/:id", bookController.getBookById);

/// book section
bookRoute.get("/", bookController.getBooks);
bookRoute.post("/", bookController.createBook); // need authen check admin middleware
bookRoute.get("/search", bookController.searchKeywordBooks);
bookRoute.get("/:id", bookController.getBookById);
bookRoute.patch("/:id", bookController.updateBook); // need authen check admin middleware
bookRoute.delete("/:id", bookController.deleteBook); // need authen check admin middleware

// Route สำหรับ AI โดยเฉพาะ (ช้า)
bookRoute.get("/:id/ai-suggestion", bookController.getAiSuggestionForBook);


bookRoute.post("/edition", bookController.createEdition);

export default bookRoute;
