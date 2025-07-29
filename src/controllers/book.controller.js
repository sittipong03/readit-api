import createError from "../utils/create-error.util.js";
import * as bookService from "../services/book.service.js";

export async function testGet(req , res ,next) {
    try {
        const data = await bookService.testGetBook()
        res.json({data , message : "Book"})
    } catch (error) {
        next(error)
    }
    
}

// Search book by AI
export async function searchBookByAI(req, res, next) {
    try {
        const userInfo = req.body
        const data = await bookService.searchBookByAI(userInfo)
        res.status(200).json({books : data})
    } catch (error) {
        next(error)
    }
}

// export async function createBook (req, res, next){
//     const {} = req.body
//     try {
        
        
//     } catch (error) {
        
//     }
// }


////////////////////////////////////////////////////////////////
// tag section : getTags  , createTags , updateTags , deleteTags
////////////////////////////////////////////////////////////////
export async function getTags (req , res ,next) {
    try {
        const data = await bookService.getTags()
        res.json(data)
    } catch (error) {
        next(error)
        
    }
}
export async function createTag (req , res , next){
    try { 
        const {name , description} = req.body
        if(!name){
            createError(400 , "Tag name is required")
        }
        const tagData = {
            data : {
                name,
                description
            }
        }
        const newTag = await bookService.postTags(tagData)
        res.json(newTag)      
    } catch (error) {
        next(error)
    }
}
export async function updateTag (req , res , next){
    try { 
        const id = req.params.id
        const {name , description} = req.body
        const idExist = await bookService.getTagsById(id)
        if (!idExist){
            createError(400 , "Tag name not found")
        }

        if(!req.body){
            createError(400 , "Update data is required")
        }
        const tagData = {
                name ,
                description 
        }
        const newTag = await bookService.patchTags(id , tagData)

        res.json(newTag)     
    } catch (error) {
        next(error)
    }
}
export async function deleteTag (req , res , next){
    try { 
        const id = req.params.id
        const idExist = await bookService.getTagsById(id)
        if (!idExist){
            createError(400 , "Tag name not found")
        }
        const newTag = await bookService.deleteTags(id)

        res.json(newTag)     
    } catch (error) {
        next(error)
    }
}