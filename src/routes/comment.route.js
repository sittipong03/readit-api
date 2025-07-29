import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; 

const commentRoute = express.Router()

const router = express.Router();

commentRoute.get('/:reviewId/comments', commentController.getAll);
commentRoute.delete('/:id', authMiddleware, commentController.deleteComment);

export default commentRoute