import { tr } from "@faker-js/faker";
import prisma from "../config/prisma.config.js";
import { searchBooks } from "../middleware/ai.middleware.js";


// book service section 

// Search book by AI
export async function searchBookByAI(userInfo) {
  // const userInfo = userInfo
  const bookResult = searchBooks(userInfo);
  const booksArr = bookResult.split(",");
  return await prisma.book.findMany({
    where: {
      OR: booksArr.map((book) => ({
        searchKey: { contain: book },
      })),
    },
  });
}

export async function getBooks() {
  return await prisma.book.findMany({
    select: {
      //--- เลือก field จากโมเดล Book ---
      id: true,
      title: true,
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
        },
        orderBy: {
          isLatest: 'desc' // เรียงให้ edition ล่าสุดขึ้นก่อน
        }
      },

      //--- ดึงข้อมูล Review ทั้งหมดของหนังสือเล่มนี้ ---
      review: {
        select: {
          id: true,
          title: true,
          content: true,
          reviewPoint: true,
          user: { // ดึงข้อมูล user ที่เขียนรีวิว
            select: {
              id: true,
              name: true
            }
          }
        },
        // take: 5, // ตัวอย่าง: ดึงมาแค่ 5 รีวิวล่าสุด
        orderBy: {
          createdAt: 'desc'
        }
      },

      //--- ดึงข้อมูล Tag ผ่านตาราง BookTag ---
      bookTag: {
        select: {
          tag: { // เข้าถึงโมเดล Tag ที่อยู่ลึกเข้าไป
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
export async function getBookById(id) {
  return await prisma.book.findUnique({
    where: { id },
    select: {
      //--- เลือก field จากโมเดล Book ---
      id: true,
      title: true,
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
        },
        orderBy: {
          isLatest: 'desc' // เรียงให้ edition ล่าสุดขึ้นก่อน
        }
      },

      //--- ดึงข้อมูล Review ทั้งหมดของหนังสือเล่มนี้ ---
      review: {
        select: {
          id: true,
          title: true,
          content: true,
          reviewPoint: true,
          user: { // ดึงข้อมูล user ที่เขียนรีวิว
            select: {
              id: true,
              name: true
            }
          }
        },
        // take: 5, // ตัวอย่าง: ดึงมาแค่ 5 รีวิวล่าสุด
        orderBy: {
          createdAt: 'desc'
        }
      },

      //--- ดึงข้อมูล Tag ผ่านตาราง BookTag ---
      bookTag: {
        select: {
          tag: { // เข้าถึงโมเดล Tag ที่อยู่ลึกเข้าไป
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
export async function getBookByName(name) {
  return await prisma.author.findUnique({ where: { name } })
}
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
          Author: { // เพิ่มการค้นหาจากชื่อผู้แต่ง
            name: {
              contains: keyword,
            },
          },
        },
      ],
    },
    include: { // ดึงข้อมูลที่เกี่ยวข้องมาด้วยเพื่อแสดงผล
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
        take: 1
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
  return await prisma.book.create({ data })
}
export async function patchBook(id, data) {
  return await prisma.book.update({
    where: { id },
    data
  })
}
export async function deleteBook(id) {
  return await prisma.book.delete({ where: { id } })
}

// edition service section 
export async function getEditions() {
  return await prisma.edition.findMany()
}
export async function getEditionById(id) {
  return await prisma.edition.findUnique({ where: { id } })
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
          isLatest: 'desc' // เรียงให้ edition ล่าสุดขึ้นก่อน
        }
      }
    }
  })
}
export async function getEditionByIsbn(isbn) {
  return await prisma.edition.findUnique({ where: { isbn } })
}
export async function postEdition(data) {
  return await prisma.edition.create({ data })
}

// author service section 
export async function getAuthors() {
  return await prisma.author.findMany()
}
export async function getAuthorById(id) {
  return await prisma.author.findUnique({
    where: { id }
  })
}
export async function getAuthorByName(name) {
  return await prisma.author.findUnique({ where: { name } })
}
export async function postAuthor(data) {
  return await prisma.author.create({ data })
}
export async function patchAuthor(id, data) {
  return await prisma.author.update({
    where: { id },
    data
  })
}
export async function deleteAuthor(id) {
  return await prisma.author.delete({ where: { id } })
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
export async function getTagsArrById(ArrId) {
  return await prisma.tag.findMany({
    where: {
      id: { in: ArrId }
    },
    select: {
      name: true
    }
  });
}
export async function getTagsByName(name) {
  return await prisma.tag.findFirst({ where: { name } })
}
export async function postTags(data) {
  return await prisma.tag.create({ data })
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
            take: 1
          }
        }
      }
    }
  });
}

export async function postUserShelf(userId, bookId, shelfType) {
  return await prisma.shelf.create({
    data: {
      userId,
      bookId,
      ShelfType: shelfType
    }
  });
}

export async function patchUserShelf(userId, bookId, fromShelf, toShelf) {
  // ใช้ transaction เพื่อให้แน่ใจว่าการลบและสร้างใหม่จะสำเร็จพร้อมกัน
  return await prisma.$transaction([
    prisma.shelf.delete({
      where: {
        bookId_userId_ShelfType: { userId, bookId, ShelfType: fromShelf }
      }
    }),
    prisma.shelf.create({
      data: {
        userId,
        bookId,
        ShelfType: toShelf
      }
    })
  ]);
}

export async function deleteUserShelf(userId, bookId, shelfType) {
  return await prisma.shelf.delete({
    where: {
      // Prisma จะใช้ index ที่เราสร้างไว้ `@@id([bookId, userId, ShelfType])`
      bookId_userId_ShelfType: {
        userId,
        bookId,
        ShelfType: shelfType
      }
    }
  });
}

