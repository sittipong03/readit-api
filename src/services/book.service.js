import prisma from "../config/prisma.config.js";
import { doYouKnow, recommandBooks, searchBooks } from "../middleware/ai.middleware.js";

export async function testGetBook() {
    return await prisma.user.findMany()
}

export async function createBook(data) {
    return await prisma.book.create({
        data: data
    })
}

// Search book by AI
export async function searchBookByAI(userInfo) {
    let userInfo = userInfo
    const bookResult = searchBooks(userInfo);
    const booksArr = bookResult.split(",");
    return await prisma.book.findMany({
        where: {
            OR: booksArr.map(book => ({
                searchKey: { contain: book }
            })
            )
        }
    });
}

// Get book by ID
export async function getBookById(bookId) {
    let bookId = bookId;
    const selectBook = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    });
    // const aiRecommand = doYouKnow(selectBook.searchKey);
    // const updateBook = await prisma.book.update({
    //     where: { id: bookId },
    //     data: { aiSuggestion: aiRecommannd }
    // });
    // const findRecommandBook = recommandBooks(selectBook.searchKey);
    // const booksArr = findRecommandBook.split("|");
    // return await prisma.book.findMany({
    //     where: {
    //         OR: booksArr.map((book) => ({
    //             searchKey: { contain: book }
    //         }))
    //     }
    // })
    return selectBook;
}

export async function aiDoYouKnow(bookId) {
    let bookId = bookId;
    const selectBook = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    });
    const aiDoYouKnow = doYouKnow(selectBook.searchKey);
    const updateBook = await prisma.book.update({
        where: { id: bookId },
        data: { aiDoYouKnow: aiDoYouKnow }
    });
    return updateBook;
}

export async function aiSuggestion(bookId) {
    let bookId = bookId;
    const selectBook = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    });

    const findRecommandBook = recommandBooks(selectBook.searchKey);
    const booksArr = findRecommandBook.split("|");
    return await prisma.book.findMany({
        where: {
            OR: booksArr.map((book) => ({
                searchKey: { contain: book }
            }))
        }
    })
}





// tag service section
export async function getTags() {
    return await prisma.tag.findMany()
}
export async function getTagsById(id) {
    return await prisma.tag.findUnique({
        where: { id }
    })
}
export async function postTags(data) {
    return await prisma.tag.create(data)
}

export async function patchTags(id, data) {
    return await prisma.tag.update({
        where: { id },
        data
    })
}

export async function deleteTags(id) {
    return await prisma.tag.delete({ where: { id } })
}