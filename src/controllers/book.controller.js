import createError from "../utils/create-error.util.js";
import * as bookService from "../services/book.service.js";
import prisma from "../config/prisma.config.js";
import cloudinary from "../config/cloudinary.config.js";
import redis from "redis";
import { ShelfType } from "@prisma/client";

////////////////////////////////////////////////////////////////
// books section : getBooks ,getBookById, searchKeywordBooks , createBook , updateBook ,deleteBook
////////////////////////////////////////////////////////////////

// Search book by AI
export async function searchBookByAI(req, res, next) {
  try {
    const userId = req.user?.id;
    const books = req.body;
    // ส่ง userId เข้าไปใน service
    const dataFromService = await bookService.searchBookByAI(books, userId);

    const formattedBooks = dataFromService.map((book) => ({
      ...book,
      rating: book.rating && book.rating.length > 0 
        ? book.rating[0].rating 
        : 0,                   
    }));

    res.status(200).json({
      books: formattedBooks,
      pagination: { hasNextPage: false },
    });
  } catch (error) {
    next(error);
  }
}

export async function searchBookTagByAI(req, res, next) {
  try {
    const books = req.body;
    const data = await bookService.searchBookByAI(books);
    // console.log("data", data);
    res.status(200).json({ books: data });
  } catch (error) {
    next(error);
  }
}

export async function aiDoYouKnow(req, res, next) {
  try {
    const { id } = req.params;
    const data = await bookService.aiDoYouKnow(id);
    res.status(200).json({ book: data });
  } catch (error) {
    next(error);
  }
}

// export async function findbookbyname(req, res, next) {
//     try {
//         const { title } = req.body; // Destructure the title from the body
//         const data = await bookService.getBookByName(title);
//         res.status(200).json({ book: data });
//     } catch (error) {
//         next(error);
//     }
// }

// export async function aiDoYouKnow(bookId) {
//     const selectBook = await prisma.book.findUnique({
//         where: {
//             id: bookId
//         }
//     });
//     const aiDoYouKnow = doYouKnow(selectBook.searchKey);
//     const updateBook = await prisma.book.update({
//         where: { id: bookId },
//         data: { aiDoYouKnow: aiDoYouKnow }
//     });
//     return updateBook;
// }

// export async function aiSuggestion(bookId) {
//     const selectBook = await prisma.book.findUnique({
//         where: {
//             id: bookId
//         }
//     });

export async function getBooks(req, res, next) {
  try {
    console.log("req.user?.id");
    console.log(req.user?.id);
    const userId = req.user?.id;

    // รับค่า page, limit, sortBy จาก query string
    const page = parseInt(req.query.page) || 1; // เริ่มที่ 1
    const limit = parseInt(req.query.limit) || 24; // จำนวนข้อมูลต่อหน้า, ค่าเริ่มต้น 24
    const sortBy = req.query.sortBy || "popularity"; // ค่าการจัดเรียง

    let tagIds = [];
    if (req.query.tags) {
      tagIds = req.query.tags.split(",");
    }

    const keyword = req.query.keyword || "";

    const dataFromService = await bookService.getBooks({
      userId,
      sortBy,
      page,
      limit,
      tagIds,
      keyword,
    });
    
    const formattedBooks = dataFromService.books.map((book) => {
      return {
        ...book,
        rating: book.rating && book.rating.length > 0
          ? book.rating[0].rating 
          : 0,               
      };
    });

    console.log("formattedBooks :");
    console.log(formattedBooks[0]);

    res.json({
      books: formattedBooks,
      pagination: dataFromService.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookById(req, res, next) {
  try {
    const id = req.params.id;
    // 1. ดึง userId จาก optionalAuthMiddleware (ถ้า user login อยู่)
    const userId = req.user?.id;

    // 2. ส่ง userId ต่อไปยัง service
    const data = await bookService.getBookById(id, userId);

    if (!data) {
      return createError(404, "Book is not found");
    }

    // 3. ปรับโครงสร้างข้อมูลก่อนส่งกลับ (สำคัญมาก)
    // Prisma จะคืนค่า relation มาเป็น Array เสมอ (เช่น rating: [{ rating: 5 }]) แต่ Component ใน Frontend ของเราคาดหวังจะได้รับเป็นตัวเลข (rating: 5) เราจึงต้องแปลงข้อมูลใน Controller ก่อนส่งกลับ
    const formattedData = { ...data };
    if (data.rating && data.rating.length > 0) {
      // แปลงจาก array [{ rating: 5 }] ให้กลายเป็น property `rating: 5`
      formattedData.rating = data.rating[0].rating;
    } else {
      // ถ้า user ยังไม่เคยให้คะแนน ให้ค่าเริ่มต้นเป็น 0
      formattedData.rating = 0;
    }

    res.json(formattedData);
  } catch (error) {
    next(error);
  }
}

export async function searchKeywordBooks(req, res, next) {
  try {
    const keyword = req.query.keyword;

    if (!keyword || keyword.trim() === "") {
      createError(400, "Can't search");
    }

    const books = await bookService.getBooksByKeyword(keyword);

    res.json(books);
  } catch (error) {
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const {
      title,
      description,
      authorId,
      name,
      bio,
      profileImage,
      editionId,
      isbn,
      pages,
      publishedYear,
      coverImage,
      isLatest,
      tagIds,
    } = req.body;
    if (!title) {
      createError(400, "Book name is required");
    }

    const bookData = {
      title,
      description,
    };

    // เช็ค authorId ว่ามาหรือไม่ ไม่มาเช็คชื่อ ถ้าชื่อตรงใช้ id เดิม ถ้าไม่ตรงสร้าง author ใหม่ แล้วใช้ id อันใหม่
    let author = null;
    if (authorId) {
      author = await bookService.getAuthorById(authorId);
      if (!author) {
        createError(404, "Author is not found");
      }
    } else if (name) {
      const existAuthorName = await bookService.getAuthorByName(name);
      if (existAuthorName) {
        author = existAuthorName;
      } else {
        const authorData = {
          name,
          bio,
          profileImage,
        };
        author = await bookService.postAuthor(authorData);
      }
    }

    let edition = null;
    if (editionId) {
      edition = await bookService.getEditionById(editionId);
      if (!edition) {
        createError(404, "Edition is not found");
      }
    } else if (isbn) {
      const existIsbn = await bookService.getEditionByIsbn(isbn);
      if (existIsbn) {
        createError(400, "ISBN is already exist");
      } else if (!pages) {
        createError(400, "Require amount of pages ");
      }
    }

    let tags = [];
    if (tagIds) {
      const tagName = await bookService.getTagsArrById(tagIds);
      tags = tagName.map((tag) => tag.name);
    }

    console.log(tags);

    /// for searchKey
    bookData.searchKey = [
      title,
      description,
      author?.name,
      isbn,
      pages,
      publishedYear,
      ...tags,
    ]
      .filter(Boolean)
      .join("|");

    if (authorId) {
      bookData.Author = {
        connect: {
          id: authorId,
        },
      };
    } else if (name) {
      bookData.Author = {
        connect: {
          id: author.id,
        },
      };
    }

    if (editionId) {
      bookData.edition = {
        connect: {
          id: editionId,
        },
      };
    } else if (isbn) {
      bookData.edition = {
        create: {
          isbn,
          pages,
          publishedYear,
          coverImage,
          isLatest,
        },
      };
    }

    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      bookData.bookTag = {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      };
    }
    const data = await bookService.postBook(bookData);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function updateBook(req, res, next) {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      aiSuggestion,
      authorId,
      name,
      bio,
      profileImage,
      editionId,
      isbn,
      pages,
      publishedYear,
      coverImage,
      isLatest,
      tagIds,
    } = req.body;
    const existBook = await bookService.getBookById(id);
    if (!existBook) {
      // แก้ไขกลับไปใช้ createError ตามที่ผู้ใช้ต้องการ
      createError(404, "Book not found");
    }

    const updateData = {};
    let authorForSearchKey = existBook.Author;
    let author = null;
    if (authorId) {
      author = await bookService.getAuthorById(authorId);
      if (!author) {
        createError(404, "Author is not found");
      }
      updateData.Author = { connect: { id: authorId } };
      authorForSearchKey = author;
    } else if (name) {
      const existAuthorName = await bookService.getAuthorByName(name);
      if (existAuthorName) {
        author = existAuthorName;
      } else {
        const authorData = {
          name,
          bio,
          profileImage,
        };
        author = await bookService.postAuthor(authorData);
      }
      updateData.Author = { connect: { id: author.id } };
      authorForSearchKey = author;
    }

    if (editionId) {
      // --- กรณีที่ 1: มี editionId ส่งมา (ต้องการอัปเดต edition ที่มีอยู่) ---
      const editionUpdatePayload = {};

      if (isbn) {
        // ตรวจสอบว่า isbn ใหม่ที่ส่งมา ซ้ำกับของคนอื่นหรือไม่
        const conflictingIsbn = await bookService.getEditionByIsbn(isbn);
        if (conflictingIsbn && conflictingIsbn.id !== editionId) {
          createError(409, "ISBN is already in use by another edition");
        }
        editionUpdatePayload.isbn = isbn;
      }

      // เพิ่ม field อื่นๆ ถ้ามีส่งมา
      if (pages) editionUpdatePayload.pages = pages;
      if (publishedYear) editionUpdatePayload.publishedYear = publishedYear;
      if (coverImage) editionUpdatePayload.coverImage = coverImage;
      if (isLatest) editionUpdatePayload.isLatest = isLatest;

      // สั่งอัปเดตเฉพาะเมื่อมีข้อมูลส่งมา
      if (Object.keys(editionUpdatePayload).length > 0) {
        updateData.edition = {
          update: {
            where: { id: editionId },
            data: editionUpdatePayload,
          },
        };
      }
    } else if (isbn) {
      // --- กรณีที่ 2: ไม่มี editionId แต่มี isbn ส่งมา (ต้องการสร้าง edition ใหม่ หรือ อัปเดตอันที่เจอ) ---
      const existingEdition = await bookService.getEditionByIsbn(isbn);
      if (existingEdition) {
        // ถ้าเจอ edition ที่มี isbn นี้อยู่แล้ว ให้อัปเดตข้อมูล
        const editionUpdatePayload = {};
        if (pages) editionUpdatePayload.pages = pages;
        if (publishedYear) editionUpdatePayload.publishedYear = publishedYear;
        if (coverImage) editionUpdatePayload.coverImage = coverImage;
        if (isLatest) editionUpdatePayload.isLatest = isLatest;

        if (Object.keys(editionUpdatePayload).length > 0) {
          updateData.edition = {
            update: {
              where: { isbn: isbn },
              data: editionUpdatePayload,
            },
          };
        }
      } else {
        // ถ้าไม่เจอ edition ที่มี isbn นี้ ให้สร้างใหม่
        if (!pages) {
          createError(400, "Require amount of pages for new edition");
        }
        updateData.edition = {
          create: { isbn, pages, publishedYear, coverImage, isLatest },
        };
      }
    }

    let tags = [];
    if (tagIds) {
      const tagName = await bookService.getTagsArrById(tagIds);
      tags = tagName.map((tag) => tag.name);
      updateData.bookTag = {
        deleteMany: {}, // ลบความสัมพันธ์กับ Tag เดิมทั้งหมด
        create: tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    } else {
      // ถ้าไม่ได้ส่ง tagIds มา ให้ใช้ชื่อ Tag เดิมสำหรับ searchKey
      tags = existBook.bookTag.map((bt) => bt.tag.name);
    }

    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (aiSuggestion !== undefined) {
      // เพิ่มการอัปเดต aiSuggestion
      updateData.aiSuggestion = aiSuggestion;
    }

    const newTitle = title !== undefined ? title : existBook.title;
    const newDescription =
      description !== undefined ? description : existBook.description;
    updateData.searchKey = [
      newTitle,
      newDescription,
      authorForSearchKey?.name,
      ...tags,
    ]
      .filter(Boolean)
      .join("|");

    // 8. เรียกใช้ service เพื่ออัปเดตข้อมูล
    const data = await bookService.patchBook(id, updateData);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;

    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      createError(404, "Book not found");
    }

    await bookService.deleteBook(id);

    // 4. ส่งสถานะ 204 (No Content) หรือ 200 เพื่อยืนยันว่าการลบสำเร็จ
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////////////////////////////////
// Authors section : getAuthors , createAuthor , updateAuthor , deleteAuthor
////////////////////////////////////////////////////////////////
export async function getAuthors(req, res, next) {
  try {
    const data = await bookService.getAuthors();
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function createAuthor(req, res, next) {
  try {
    const { name, bio, profileImage } = req.body;
    if (!name) {
      createError(400, "Author is required");
    }
    const nameExist = await bookService.getAuthorByName(name);
    if (
      name.toLowerCase().trim() === nameExist?.name.toLocaleLowerCase().trim()
    ) {
      createError(400, "Author is already exist");
    }
    const authorData = {
      name,
      bio,
      profileImage,
    };
    const newTag = await bookService.postAuthor(authorData);
    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function updateAuthor(req, res, next) {
  try {
    const id = req.params.id;
    const { name, bio, profileImage } = req.body;
    console.log(id);
    const idExist = await bookService.getAuthorById(id);
    if (!idExist) {
      createError(404, "Author not found");
    }
    if (!req.body) {
      createError(400, "Update data is required");
    }
    if (name) {
      const nameExist = await bookService.getAuthorByName(name);
      if (nameExist && nameExist.id !== id) {
        return createError(400, "Author name is already in use");
      }
    }

    const authorData = {
      name,
      bio,
      profileImage,
    };
    const newTag = await bookService.patchAuthor(id, authorData);

    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function deleteAuthor(req, res, next) {
  try {
    const id = req.params.id;
    const idExist = await bookService.getAuthorById(id);
    if (!idExist) {
      createError(400, "Author name not found");
    }
    const newTag = await bookService.deleteAuthor(id);

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////////////////////////////////
// tag section : getTags , createTags , updateTags , deleteTags
////////////////////////////////////////////////////////////////
export async function getTags(req, res, next) {
  try {
    const data = await bookService.getTags();
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function createTag(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      createError(400, "Tag name is required");
    }
    const nameExist = await bookService.getTagsByName(name);
    if (name.toLowerCase().trim() === nameExist?.name.toLowerCase().trim()) {
      createError(400, "Tag name is already exist");
    }
    const tagData = {
      name,
      description,
    };
    const newTag = await bookService.postTags(tagData);
    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function updateTag(req, res, next) {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const idExist = await bookService.getTagsById(id);
    if (!idExist) {
      createError(404, "Tag name not found");
    }

    if (!req.body) {
      createError(400, "Update data is required");
    }
    if (name) {
      const nameExist = await bookService.getTagsByName(name);
      if (nameExist && nameExist.id !== id) {
        return createError(400, "Tag name is already in use");
      }
    }
    const tagData = {
      name,
      description,
    };
    const newTag = await bookService.patchTags(id, tagData);

    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function deleteTag(req, res, next) {
  try {
    const id = req.params.id;
    const idExist = await bookService.getTagsById(id);
    if (!idExist) {
      createError(404, "Tag name not found");
    }
    const newTag = await bookService.deleteTags(id);

    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////////////////////////////////
// shelf / wishread : getUserShelf , createBookToShelf , updateBookOnShelf , deleteBookFromShelf
////////////////////////////////////////////////////////////////
export async function getUserShelf(req, res, next) {
  try {
    const userId = req.user.id; // mock รอ userId จาก middleware authentication
    // const {userId} = req.body // mock ต้องลบทิ้งใช้ข้างบน
    const type = req.query.type;

    const validTypes = ["WISHLIST", "CURRENTLY_READING", "READ", "FAVORITE"];
    if (type && !validTypes.includes(type.toUpperCase())) {
      createError(400, "Invalid shelf type provided.");
    }

    const shelfItems = await bookService.getUserShelf(
      userId,
      type ? type.toUpperCase() : undefined
    );
    res.json(shelfItems);
  } catch (error) {
    next(error);
  }
}
export async function createBookToShelf(req, res, next) {
  try {
    // const userId = req.user.id; // mock รอ userId จาก middleware authentication
    const { bookId, shelfType, userId } = req.body; // mock userId ต้อง เอา userId ออก

    if (!bookId || !shelfType) {
      createError(400, "bookId and shelfType are required.");
    }

    // (Optional) ตรวจสอบว่ามี bookId นี้อยู่จริงหรือไม่
    const bookExists = await bookService.getBookById(bookId);
    if (!bookExists) {
      createError(404, "Book not found.");
    }

    console.log("first---------", { userId, bookId, shelfType });

    const newShelfItem = await bookService.postUserShelf(
      userId,
      bookId,
      shelfType
    );
    res.json(newShelfItem);
  } catch (error) {
    next(error);
  }
}
export async function updateBookOnShelf(req, res, next) {
  try {
    // const userId = req.user.id; // mock รอ userId จาก middleware authentication
    const { bookId, fromShelf, toShelf, userId } = req.body; // mock userId ต้อง เอา userId ออก

    if (!bookId || !fromShelf || !toShelf) {
      createError(400, "bookId, fromShelf, and toShelf are required.");
    }

    if (fromShelf === toShelf) {
      createError(400, "Cannot move a book to the same shelf.");
    }

    const movedItem = await bookService.patchUserShelf(
      userId,
      bookId,
      fromShelf,
      toShelf
    );
    res.json(movedItem);
  } catch (error) {
    next(error);
  }
}
export async function deleteBookFromShelf(req, res, next) {
  try {
    const userId = req.user.id; // mock รอ userId จาก middleware authentication
    const { bookId, shelfType } = req.params;

    if (!bookId || !shelfType) {
      createError(400, "bookId and shelfType are required in the URL path.");
    }

    await bookService.deleteUserShelf(userId, bookId, shelfType);
    res.json({ message: "Book removed from shelf successfully." });
  } catch (error) {
    next(error);
  }
}

export const getAiSuggestionForBook = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Controller received ID for AI suggestion:", id);

    if (!id) {
      return res.status(400).json({ message: "Book ID is missing" });
    }

    // --- ดึงข้อมูลหนังสือและตรวจสอบแคช ---
    const book = await prisma.book.findUnique({
      where: { id },
      select: { title: true, aiSuggestion: true },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.aiSuggestion) {
      return res.status(200).json({ suggestion: book.aiSuggestion });
    }

    // --- เรียกใช้ AI Service ---
    const resultFromService = await bookService.aiDoYouKnow(id);

    // --- ตรวจสอบและจัดการผลลัพธ์ที่ได้จาก Service ---
    // ตรวจสอบว่าผลลัพธ์ที่ได้เป็น string หรือไม่
    if (typeof resultFromService === "string") {
      // ✅ กรณี AI ทำงานสำเร็จ (ได้ string กลับมา)
      const aiText = resultFromService;
      console.log("AI suggestion from Google:", aiText);

      // บันทึก string ลง DB
      prisma.book
        .update({
          where: { id },
          data: { aiSuggestion: aiText }, // <--- แก้ไข: บันทึกเฉพาะข้อความ
        })
        .catch((err) => console.error("Failed to cache AI suggestion:", err));

      // ส่ง string กลับไปให้ Frontend
      res.status(200).json({ suggestion: aiText });
    } else {
      // ❌ กรณี AI ทำงานล้มเหลว (ไม่ได้ string กลับมา)
      console.error(
        "AI Service did not return a string. It might have failed."
      );
      // ส่งข้อความ Error กลับไปให้ Frontend เพื่อให้แสดงผลอย่างเหมาะสม
      res
        .status(503)
        .json({ message: "AI service is currently unavailable or failed." });
    }
  } catch (error) {
    console.error("Critical error in getAiSuggestionForBook:", error);
    res.status(500).json({ message: "Failed to generate AI suggestion." });
  }
};

export const createEdition = async (req, res, next) => {
  try {
    const result = await bookService.postEdition(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
