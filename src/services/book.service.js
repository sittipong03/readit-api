import prisma from "../config/prisma.config.js";
import { searchBooks } from "../middleware/ai.middleware.js";

export async function testGetBook () {
    return await prisma.user.findMany()
}

export async function createBook(data){
    return await prisma.book.create ({
        data : data
    }) 
}

// Search book by AI
export async function searchBookByAI(userInfo){
    const userInfo = userInfo
    const bookResult = searchBooks(userInfo);
    const booksArr =  bookResult.split(",");
    return await prisma.book.findMany ({
        where: {
            OR: booksArr.map(book => ({
                searchKey : {contain: book}
            }))
        }
    });
}





// tag service section
export async function getTags(){
    return await prisma.tag.findMany()
}
export async function getTagsById(id){
    return await prisma.tag.findUnique({
        where : {id}
    })
}
export async function postTags(data){
    return await prisma.tag.create(data)
}

export async function patchTags(id , data){
    return await prisma.tag.update({ 
        where : {id},
        data
    })
}

export async function deleteTags(id){
    return await prisma.tag.delete({where: { id}})
}