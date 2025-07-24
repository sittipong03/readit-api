import express from "express"
import * as bookController from "../controllers/book.controller.js"


const bookRoute = express.Router()

bookRoute.get('/' ,bookController.testGet)






// tags
bookRoute.get('/tags' , bookController.getTags)
bookRoute.post('/tags' , bookController.createTag)
bookRoute.patch('/tags/:id', bookController.updateTag)
bookRoute.delete('/tags/:id' , bookController.deleteTag)

export default bookRoute