import express from "express"
import * as affiliateController from "../controllers/affiliate.controller.js"

const affiliateRoute = express.Router()

affiliateRoute.get('/' ,affiliateController.testGet)

export default affiliateRoute