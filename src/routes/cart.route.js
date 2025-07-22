import express from "express"
import * as cartController from "../controllers/cart.controller.js"

const cartRoute = express.Router()

cartRoute.get('/' , cartController.testGet)

export default cartRoute