import createError from "../utils/create-error.util.js"
import * as affiliateService from "../services/affiliate.service.js"

export async function testGet(req , res ,next) {
    try {
        const data = await affiliateService.testGetAffiliate()
        res.json({data , message : "affiliate"})
    } catch (error) {
        next(error)
    }
    
}