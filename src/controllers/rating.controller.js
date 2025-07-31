import { rateBookService } from '../services/rating.service.js';

export async function rate(req, res) {
    const {
        id: bookId
    } = req.params;
    const {
        rating
    } = req.body;
    const userId = req.user.id;

    try {
        const newRating = await rateBookService(userId, bookId, rating);
        return res.status(201).json({
            message: 'Book rated successfully',
            rating: newRating
        });
    } catch (error) {
        if (error.message === 'Rating must be between 1 and 5.') {
            return res.status(400).json({
                message: error.message
            });
        }
        if (error.message === 'Book not found.') {
            return res.status(404).json({
                message: error.message
            });
        }
        console.error('Error rating book:', error);
        return res.status(500).json({
            message: 'Failed to rate book.'
        });
    }
}