import createError from "../utils/create-error.util.js"
import * as userService from "../services/user.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await userService.testGetUser()
        res.json({data , message : "User"})
    } catch (error) {
        next(error)
    }
    
}