import express from 'express';
import * as ratingController from '../controllers/rating.controller.js';
import { authMiddleware } from "../middleware/auth.middleware.js";

const ratingRoute = express.Router()

ratingRoute.post('/:id', authMiddleware, ratingController.rate);

export default ratingRoute