import express from "express"
import * as bookController from "../controllers/book.controller.js"


const bookRoute = express.Router()

bookRoute.get('/' ,bookController.testGet)

export default bookRoute