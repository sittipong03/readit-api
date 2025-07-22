import createError from "../utils/create-error.util.js"
import * as authService from "../services/auth.service.js"

export async function testGetUser(req , res ,next) {
    try {
        const data = await authService.testGetUser()
        res.json({data , message : "auth"})
    } catch (error) {
        next(error)
    }
    
}