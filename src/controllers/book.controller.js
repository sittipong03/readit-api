import createError from "../utils/create-error.util.js"
import * as bookService from "../services/book.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await bookService.testGetBook()
        res.json({data , message : "Book"})
    } catch (error) {
        next(error)
    }
    
}