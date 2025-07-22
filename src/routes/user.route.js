import express from "express"
import * as userController from "../controllers/user.controller.js"


const userRoute = express.Router()

userRoute.get('/' , userController.testGet)

export default userRoute