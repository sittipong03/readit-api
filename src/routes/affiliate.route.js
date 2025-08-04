import express from "express";
import * as affiliateController from "../controllers/affiliate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const affiliateRoute = express.Router();

affiliateRoute.post("/", authMiddleware, affiliateController.registerAffiliate);
affiliateRoute.get("/", authMiddleware, affiliateController.getSelf);

export default affiliateRoute;
