import { tr } from "@faker-js/faker";
import prisma from "../config/prisma.config.js";
import {
  searchBooks,
  doYouKnow,
  recommandBooks,
} from "../middleware/ai.middleware.js";
import { ShelfType } from "@prisma/client";

// book service section

// Search book by AI
export async function searchBookByAI(books, userId) {
  // 1. รับ userId เพิ่ม
  const bookResult = await searchBooks(books);
  console.log("bookResult", bookResult);
  const booksArr = bookResult.split(",");

  // 2. ยก select query ที่สมบูรณ์มาจาก getBooks
  // เพื่อให้โครงสร้างข้อมูลเหมือนกัน 100%
  const selectQuery = {
    id: true,
    title: true,
    description: true,
    aiSuggestion: true,
    ratingCount: true,
    reviewCount: true,
    averageRating: true,
    oneStarCount: true,
    twoStarCount: true,
    threeStarCount: true,
    fourStarCount: true,
    fiveStarCount: true,
    Author: {
      select: {
        id: true,
        name: true,
      },
    },
    review: {
      select: {
        id: true,
        title: true,
        content: true,
        reviewPoint: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    },
    edition: {
      select: {
        id: true,
        isbn: true,
        coverImage: true,
        isLatest: true,
        pages: true,
      },
      orderBy: {
        isLatest: "desc",
      },
    },
    product: {
      select: {
        id: true,
        price: true,
        stockQuantity: true,
      },
    },
    bookTag: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  // 3. ส่วนสำคัญ: เพิ่มข้อมูล rating ถ้ามี userId ส่งมา
  if (userId) {
    selectQuery.rating = {
      where: {
        userId: userId,
      },
      select: {
        rating: true,
      },
    };

    // (Optional) คุณอาจจะอยากให้ review ที่ดึงมาเป็นของ user คนนั้นๆ ด้วย
    selectQuery.review = {
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    };
  }

  return await prisma.book.findMany({
    where: {
      OR: booksArr.flatMap((book) => [
        { title: { contains: book } },
        { searchKey: { contains: book } },
      ]),
    },
    select: selectQuery, // 4. ใช้ select query ตัวใหม่นี้
  });
}

export async function aiDoYouKnow(bookId) {
  const selectBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });
  console.log(selectBook);
  const aiDoYouKnow = await doYouKnow(selectBook.title);
  // console.log(aiDoYouKnow);
  const updateBook = await prisma.book.update({
    where: { id: bookId },
    data: { aiSuggestion: aiDoYouKnow },
  });

  return updateBook;
}

export async function aiSuggestion(bookId) {
  const selectBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  const findRecommandBook = recommandBooks(selectBook.searchKey);
  const booksArr = findRecommandBook.split("|");
  return await prisma.book.findMany({
    where: {
      OR: booksArr.map((book) => ({
        title: { contain: book },
        searchKey: { contain: book },
      })),
    },
  });
}
export async function getAllNameBook() {
  return await prisma.book.findMany({
    select: {
      title: true,
    },
  });
}

export async function getBooks({
  userId,
  sortBy,
  page,
  limit,
  tagIds,
  keyword,
}) {
  const skip = (page - 1) * limit;

  let orderBy = {};
  switch (sortBy) {
    case "rating":
      orderBy = { averageRating: "desc" };
      break;
    case "title_asc":
      orderBy = { title: "asc" };
      break;
    case "title_desc":
      orderBy = { title: "desc" };
      break;
    case "popularity":
    default:
      orderBy = { ratingCount: "desc" };
      break;
  }

  // สร้างเงื่อนไขการค้นหา (where clause) แบบไดนามิก
  const whereClause = {};

  // --- เพิ่มเงื่อนไขการค้นหาจาก keyword ---
  if (keyword && keyword.trim() !== "") {
    whereClause.searchKey = {
      contains: keyword,
    };
  }

  // --- เพิ่มเงื่อนไขการ Filter จาก tags ---
  if (tagIds && tagIds.length > 0) {
    whereClause.AND = tagIds.map((tagId) => ({
      bookTag: {
        some: {
          tagId: tagId,
        },
      },
    }));
  }

  // สร้าง select query พื้นฐาน
  const selectQuery = {
    id: true,
    title: true,
    description: true,
    aiSuggestion: true,
    ratingCount: true,
    reviewCount: true,
    averageRating: true,
    oneStarCount: true,
    twoStarCount: true,
    threeStarCount: true,
    fourStarCount: true,
    fiveStarCount: true,

    //--- ดึงข้อมูล Author ---
    Author: {
      select: {
        id: true,
        name: true,
      },
    },

    //--- FIX: ดึงข้อมูล Review ---
    review: {
      select: {
        id: true,
        title: true,
        content: true,
        reviewPoint: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5, // ดึงรีวิวล่าสุดมา 5 อัน
      orderBy: {
        createdAt: "desc",
      },
    },

    //--- ดึงข้อมูล Edition ---
    edition: {
      select: {
        id: true,
        isbn: true,
        coverImage: true,
        isLatest: true,
        pages: true,
      },
      orderBy: {
        isLatest: "desc",
      },
    },

    //--- ดึงข้อมูล Product ---
    product: {
      select: {
        id: true,
        price: true,
        stockQuantity: true,
      },
    },

    //--- ดึงข้อมูล Tag ---
    bookTag: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  // --- userId ให้ดึง rating และ review ของ user คนนั้นโดยเฉพาะ ---
  if (userId) {
    selectQuery.rating = {
      where: {
        userId: userId,
      },
      select: {
        rating: true,
      },
    };

    selectQuery.review = {
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    };
  }

  // ดึงข้อมูลหนังสือและนับจำนวนทั้งหมดพร้อมกันโดยใช้ transaction
  const [books, totalBooks] = await prisma.$transaction([
    prisma.book.findMany({
      where: whereClause,
      select: selectQuery,
      orderBy: orderBy,
      skip: skip,
      take: limit,
    }),
    prisma.book.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalBooks / limit);

  return {
    books,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      totalBooks: totalBooks,
    },
  };
}

export async function getBookById(id, userId) {
  const selectQuery = {
    //--- เลือก field จากโมเดล Book ---
    id: true,
    title: true,
    aiSuggestion: true,
    description: true,
    ratingCount: true,
    reviewCount: true,
    averageRating: true,
    oneStarCount: true,
    twoStarCount: true,
    threeStarCount: true,
    fourStarCount: true,
    fiveStarCount: true,

    //--- ดึงข้อมูล Author ที่เกี่ยวข้อง ---
    Author: {
      select: {
        id: true,
        name: true,
      },
    },

    //--- ดึงข้อมูล Edition ทั้งหมดของหนังสือเล่มนี้ ---
    edition: {
      select: {
        id: true,
        isbn: true,
        coverImage: true,
        isLatest: true,
        pages: true,
        publishedYear: true,
      },
      orderBy: {
        isLatest: "desc",
      },
    },

    //--- ดึงข้อมูล Review ทั้งหมดของหนังสือเล่มนี้ ---
    review: {
      select: {
        id: true,
        title: true,
        content: true,
        reviewPoint: true,
        createdAt: true, // ดึงเวลาที่สร้างรีวิวมาด้วย
        user: {
          // ดึงข้อมูล user ที่เขียนรีวิว
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            reviewCount: true,
            followerCount: true,
            // ดึงข้อมูล follower/following ของผู้รีวิว (ตามโค้ดก่อนหน้า)
            followers: {
              select: {
                follower: {
                  select: { id: true, name: true, avatarUrl: true },
                },
              },
            },
            following: {
              select: {
                following: {
                  select: { id: true, name: true, avatarUrl: true },
                },
              },
            },
          },
        },

        // --- ส่วนที่เพิ่ม: นับจำนวน comments และ likes ---
        _count: {
          select: {
            comments: true, // จะนับจำนวนคอมเมนต์ทั้งหมดที่เชื่อมกับรีวิวนี้
            likes: true, // จะนับจำนวนไลก์ทั้งหมดที่เชื่อมกับรีวิวนี้
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    },
    product: {
      select: {
        id: true,
        sku: true,
        price: true,
        stockQuantity: true,
        productType: true,
      },
    },
    //--- ดึงข้อมูล Tag ผ่านตาราง BookTag ---
    bookTag: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  // เพิ่มการ query ข้อมูล rating ถ้ามี userId ส่งมา
  if (userId) {
    selectQuery.rating = {
      where: {
        userId: userId,
      },
      select: {
        rating: true, // ดึงค่า rating ที่ user คนนี้เคยให้ไว้
      },
    };
  }

  return await prisma.book.findUnique({
    where: { id },
    select: selectQuery,
  });
}

// export async function getBookByName(title) {
//   return await prisma.author.findFirst({ where: { title} })
// }
export async function getBooksByKeyword(keyword) {
  return await prisma.book.findMany({
    where: {
      OR: [
        {
          searchKey: {
            contains: keyword,
          },
        },
        {
          title: {
            contains: keyword,
          },
        },
        {
          Author: {
            // เพิ่มการค้นหาจากชื่อผู้แต่ง
            name: {
              contains: keyword,
            },
          },
        },
      ],
    },
    include: {
      // ดึงข้อมูลที่เกี่ยวข้องมาด้วยเพื่อแสดงผล
      Author: {
        select: {
          id: true,
          name: true,
        },
      },
      edition: {
        select: {
          id: true,
          isbn: true,
          coverImage: true,
        },
        where: { isLatest: true }, // เอามาเฉพาะ edition ล่าสุด
        take: 1,
      },
      bookTag: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
export async function postBook(data) {
  return await prisma.book.create({ data });
}
export async function patchBook(id, data) {
  return await prisma.book.update({
    where: { id },
    data,
  });
}
export async function deleteBook(id) {
  return await prisma.book.delete({ where: { id } });
}

// edition service section
export async function getEditions() {
  return await prisma.edition.findMany();
}
export async function getEditionById(id) {
  return await prisma.edition.findUnique({ where: { id } });
}
export async function getEditionByBookId(id) {
  return await prisma.book.findUnique({
    where: { id },
    select: {
      edition: {
        select: {
          id: true,
          isbn: true,
          coverImage: true,
          isLatest: true,
          pages: true,
        },
        orderBy: {
          isLatest: "desc", // เรียงให้ edition ล่าสุดขึ้นก่อน
        },
      },
    },
  });
}
export async function getEditionByIsbn(isbn) {
  return await prisma.edition.findUnique({ where: { isbn } });
}
export async function postEdition(data) {
  return await prisma.edition.create({ data });
}

// author service section
export async function getAuthors() {
  return await prisma.author.findMany();
}
export async function getAuthorById(id) {
  return await prisma.author.findUnique({
    where: { id },
  });
}
export async function getAuthorByName(name) {
  return await prisma.author.findUnique({ where: { name } });
}
export async function postAuthor(data) {
  return await prisma.author.create({ data });
}
export async function patchAuthor(id, data) {
  return await prisma.author.update({
    where: { id },
    data,
  });
}
export async function deleteAuthor(id) {
  return await prisma.author.delete({ where: { id } });
}

// tag service section
export async function getTags() {
  return await prisma.tag.findMany();
}
export async function getTagsById(id) {
  return await prisma.tag.findUnique({
    where: { id },
  });
}
export async function getTagsArrById(ArrId) {
  return await prisma.tag.findMany({
    where: {
      id: { in: ArrId },
    },
    select: {
      name: true,
    },
  });
}
export async function getTagsByName(name) {
  return await prisma.tag.findFirst({ where: { name } });
}
export async function postTags(data) {
  return await prisma.tag.create({ data });
}
export async function patchTags(id, data) {
  return await prisma.tag.update({
    where: { id },
    data,
  });
}
export async function deleteTags(id) {
  return await prisma.tag.delete({ where: { id } });
}

// shelf / wishread service section
export async function getUserShelf(userId, shelfType) {
  const search = { userId };
  if (shelfType) {
    search.ShelfType = shelfType;
  }
  return await prisma.shelf.findMany({
    where: search,
    include: {
      book: {
        select: {
          id: true,
          title: true,
          ratingCount: true,
          reviewCount: true,
          averageRating: true,
          Author: { select: { name: true } },
          edition: {
            where: { isLatest: true },
            select: { coverImage: true },
            take: 1,
          },
        },
      },
    },
  });
}

export async function postUserShelf(userId, bookId, shelfType) {
  const result = await prisma.shelf.create({
    data: {
      userId,
      bookId,
      shelfType,
    },
  });

  return result;
}

export async function patchUserShelf(userId, bookId, fromShelf, toShelf) {
  // ใช้ transaction เพื่อให้แน่ใจว่าการลบและสร้างใหม่จะสำเร็จพร้อมกัน
  return await prisma.$transaction([
    prisma.shelf.delete({
      where: {
        bookId_userId_ShelfType: { userId, bookId, ShelfType: fromShelf },
      },
    }),
    prisma.shelf.create({
      data: {
        userId,
        bookId,
        ShelfType: toShelf,
      },
    }),
  ]);
}

export async function deleteUserShelf(userId, bookId, shelfType) {
  return await prisma.shelf.delete({
    where: {
      // Prisma จะใช้ index ที่เราสร้างไว้ `@@id([bookId, userId, ShelfType])`
      bookId_userId_ShelfType: {
        userId,
        bookId,
        ShelfType: shelfType,
      },
    },
  });
}
