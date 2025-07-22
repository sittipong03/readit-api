import express from "express"
import * as authController from "../controllers/auth.controller.js"


const authRoute = express.Router()

authRoute.get('/' , authController.testGetUser)

export default authRoute