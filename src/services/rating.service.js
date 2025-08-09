import prisma from "../config/prisma.config.js";

export async function rateBookService(userId, bookId, rating) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  // ใช้ transaction เพื่อให้แน่ใจว่าทุกอย่างทำงานสำเร็จพร้อมกัน
  const updatedBookWithRating = await prisma.$transaction(async (tx) => {
    // 1. สร้างหรืออัปเดต Rating (Upsert)
    const newRating = await tx.rating.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { rating },
      create: { userId, bookId, rating },
    });

    // 2. ดึงข้อมูล rating ทั้งหมดของหนังสือเล่มนี้เพื่อคำนวณใหม่
    const allRatings = await tx.rating.findMany({
      where: { bookId: bookId },
      select: { rating: true }
    });
    
    // 3. คำนวณค่าเฉลี่ยและจำนวน rating ใหม่
    const ratingCount = allRatings.length;
    const totalRatingsSum = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRatingsSum / ratingCount).toFixed(2)); // เพิ่มความละเอียดเป็น 2 ตำแหน่ง

    // 4. อัปเดตข้อมูลในตาราง Book
    await tx.book.update({
      where: { id: bookId },
      data: {
        ratingCount: ratingCount,
        averageRating: averageRating,
      },
    });
    
    // 5. ดึงข้อมูลหนังสือล่าสุดทั้งหมด พร้อมกับ rating ของ user คนปัจจุบัน
    const finalBookData = await tx.book.findUnique({
        where: { id: bookId },
        // Select ข้อมูลทั้งหมดที่ Card ต้องการ
        select: {
            id: true,
            title: true,
            averageRating: true,
            ratingCount: true,
            Author: { select: { name: true } },
            edition: { 
                where: { isLatest: true },
                select: { coverImage: true }
            },
            // ดึง rating เฉพาะของ user คนนี้มาด้วย
            rating: {
                where: { userId: userId },
                select: { rating: true }
            }
        }
    });

    if (!finalBookData) {
        throw new Error('Book not found after update.');
    }

    return finalBookData;
  });
  
  return updatedBookWithRating;
}