import express from "express";
import { handleGetAllTags } from "../controllers/tag.controller.js";

const tagRoute = express.Router();

tagRoute.get("/", handleGetAllTags);

export default tagRoute;