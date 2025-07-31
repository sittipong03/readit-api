import express from 'express';
import * as ratingController from '../controllers/rating.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const ratingRoute = express.Router()

ratingRoute.post('/:id/rating', authMiddleware, ratingController.rate);

export default ratingRoute