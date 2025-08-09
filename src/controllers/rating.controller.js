import { rateBookService } from '../services/rating.service.js';

export async function rate(req, res, next) { 
    const { id: bookId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    try {
        const updatedBook = await rateBookService(userId, bookId, rating);
        
        return res.status(200).json(updatedBook);

    } catch (error) {
        next(error); 
    }
}