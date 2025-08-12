import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * ตรวจสอบและแก้ไข reviewCount ของหนังสือทั้งหมด
 */
async function reconcileBookReviewCounts() {
  console.log('Starting reconciliation for Book review counts...');
  const books = await prisma.book.findMany({
    select: { id: true, reviewCount: true },
  });

  let correctedCount = 0;
  for (const book of books) {
    // นับจำนวนรีวิวจริงๆ จากตาราง Review
    const actualReviewCount = await prisma.review.count({
      where: { bookId: book.id },
    });

    // เปรียบเทียบกับค่าที่เก็บไว้
    if (book.reviewCount !== actualReviewCount) {
      console.log(`Fixing book ${book.id}: Stored count was ${book.reviewCount}, actual is ${actualReviewCount}`);
      
      // ถ้าไม่ตรงกันให้อัปเดตเป็นค่าที่ถูกต้อง
      await prisma.book.update({
        where: { id: book.id },
        data: { reviewCount: actualReviewCount },
      });
      correctedCount++;
    }
  }
  console.log(`Finished reconciling books. Corrected ${correctedCount} records.`);
}

/**
 * ตรวจสอบและแก้ไข reviewCount ของผู้ใช้ทั้งหมด
 */
async function reconcileUserReviewCounts() {
  console.log('Starting reconciliation for User review counts...');
  const users = await prisma.user.findMany({
    select: { id: true, reviewCount: true },
  });

  let correctedCount = 0;
  for (const user of users) {
    const actualReviewCount = await prisma.review.count({
      where: { userId: user.id },
    });

    if (user.reviewCount !== actualReviewCount) {
      console.log(`Fixing user ${user.id}: Stored count was ${user.reviewCount}, actual is ${actualReviewCount}`);
      await prisma.user.update({
        where: { id: user.id },
        data: { reviewCount: actualReviewCount },
      });
      correctedCount++;
    }
  }
  console.log(`Finished reconciling users. Corrected ${correctedCount} records.`);
}


async function main() {
  try {
    await reconcileBookReviewCounts();
    await reconcileUserReviewCounts();
    console.log('Reconciliation complete!');
  } catch (error) {
    console.error('An error occurred during reconciliation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();