import createError from "../utils/create-error.util.js"
import * as cartService from "../services/cart.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await cartService.testGetCart()
        if (data){
            createError(404 , "create error is working")
        }
        res.json({data , message : "Cart"})
    } catch (error) {
        next(error)
    }
    
}