import { rateBookService } from '../services/rating.service.js';

export async function rate(req, res, next) { 
    const { id: bookId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    try {
        const updatedBook = await rateBookService(userId, bookId, rating);

        const formattedData = { ...updatedBook };
        if (updatedBook.rating && updatedBook.rating.length > 0) {
          formattedData.rating = updatedBook.rating[0].rating;
        } else {
          formattedData.rating = 0;
        }
        
        return res.status(200).json(formattedData);

    } catch (error) {
        next(error); 
    }
}