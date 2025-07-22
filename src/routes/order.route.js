import express from "express"
import * as orderController from "../controllers/order.controller.js"


const orederRoute = express.Router()

orederRoute.get('/' , orderController.testGet)

export default orederRoute