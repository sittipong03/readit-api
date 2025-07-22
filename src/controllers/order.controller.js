import createError from "../utils/create-error.util.js"
import * as orderService from "../services/order.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await orderService.testGetOrder()
        res.json({data , message : "Order"})
    } catch (error) {
        next(error)
    }
    
}