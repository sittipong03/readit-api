import createError from "../utils/create-error.util.js"
import * as reviewService from "../services/review.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await reviewService.testGetReview()
        res.json({data , message : "Review"})
    } catch (error) {
        next(error)
    }
    
}