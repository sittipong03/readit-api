import express from "express";
import * as affiliateController from "../controllers/affiliate.controller.js";

const affiliateRoute = express.Router();

affiliateRoute.post("/", affiliateController.registerAffiliate);
affiliateRoute.get("/:userId", affiliateController.getSelf);

export default affiliateRoute;
