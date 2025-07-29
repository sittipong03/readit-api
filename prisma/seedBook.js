import prisma from '../src/config/prisma.config.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const hashPassword = bcrypt.hashSync("123456", 10);
const NUM_AUTHORS = 20;
const NUM_BOOKS = 50;

// --- 👤 ข้อมูล User (คงเดิม) ---
const userData = [
    { email: "buzz.l@example.com", password: hashPassword, name: "Buzz Lightyear", role: "USER", emailVerified: true, reviewCount: 98, followerCount: 152 },
    { email: "admin@readit.net", password: hashPassword, name: "Admin", role: "ADMIN", emailVerified: true, reviewCount: 2, followerCount: 5 },
    { email: "slinky.d@example.com", password: hashPassword, name: "Slinky Dog", role: "USER", emailVerified: true, reviewCount: 0, followerCount: 0 }
];

// --- 🏷️ ข้อมูล Tag (ปรับปรุงให้มี isActive) ---
const tagData = [
  { name: 'Art', description: 'หนังสือที่รวบรวมผลงาน หรือให้ความรู้ด้านทัศนศิลป์', isActive: true },
  { name: 'Biography', description: 'หนังสือที่เล่าเรื่องราวชีวิตจริงของบุคคลใดบุคคลหนึ่ง', isActive: true },
  { name: 'Business', description: 'หนังสือที่ให้ความรู้และกลยุทธ์ในการทำธุรกิจ', isActive: true },
  // ... (ใส่ tagData ที่เหลือทั้งหมดของคุณที่นี่ โดยเพิ่ม , isActive: true) ...
  { name: 'Young Adult', description: 'หนังสือสำหรับวัยรุ่น (YA) ที่มีเนื้อหาเข้มข้น', isActive: true }
];


async function main() {
    console.log("🚀 เริ่มกระบวนการ Seeding...");

    // --- 1. สร้างข้อมูลพื้นฐาน: Users, Tags, Authors ---
    console.log("👤 Seeding Users...");
    // await prisma.user.createMany({ data: userData, skipDuplicates: true }); // หากรันแยกแล้ว คอมเมนต์ไว้ได้

    console.log("🏷️ Seeding Tags...");
    await prisma.tag.createMany({ data: tagData, skipDuplicates: true });
    
    console.log("🧑‍🎨 Generating and Seeding Authors...");
    const authorsToCreate = Array.from({ length: NUM_AUTHORS }, () => ({
        name: faker.person.fullName(),
        bio: faker.person.bio(),
        profileImage: faker.image.avatar(),
    }));
    await prisma.author.createMany({ data: authorsToCreate, skipDuplicates: true });

    // --- 2. ดึง ID ของ Authors และ Tags ที่สร้างขึ้นจริงจากฐานข้อมูล ---
    console.log("🔍 Fetching created Authors and Tags...");
    const createdAuthors = await prisma.author.findMany({ select: { id: true } });
    const createdTags = await prisma.tag.findMany({ select: { id: true } });
    
    if (createdAuthors.length === 0 || createdTags.length === 0) {
        throw new Error("❌ ไม่สามารถดึงข้อมูล Authors หรือ Tags ได้");
    }
    
    // --- 3. สร้างข้อมูลหนังสือ (Books) พร้อมข้อมูลที่เกี่ยวข้อง (Editions, Tags) ---
    console.log(`📚 Seeding ${NUM_BOOKS} Books with relations...`);
    for (let i = 0; i < NUM_BOOKS; i++) {
        const randomAuthor = faker.helpers.arrayElement(createdAuthors);
        const numberOfTags = faker.number.int({ min: 1, max: 4 });
        const randomTags = faker.helpers.arrayElements(createdTags, numberOfTags);
        
        // สร้างข้อมูล Rating แบบสมจริง
        const fiveStarCount = faker.number.int({ min: 5, max: 1000 });
        const fourStarCount = faker.number.int({ min: 5, max: 800 });
        const threeStarCount = faker.number.int({ min: 2, max: 500 });
        const twoStarCount = faker.number.int({ min: 1, max: 100 });
        const oneStarCount = faker.number.int({ min: 0, max: 50 });
        
        const ratingCount = fiveStarCount + fourStarCount + threeStarCount + twoStarCount + oneStarCount;
        const totalScore = (5 * fiveStarCount) + (4 * fourStarCount) + (3 * threeStarCount) + (2 * twoStarCount) + (1 * oneStarCount);
        const averageRating = ratingCount > 0 ? parseFloat((totalScore / ratingCount).toFixed(2)) : 0;

        const bookTitle = faker.book.title();
        
        // ใช้ `create` เพื่อสร้าง Book, Edition, และเชื่อม Tag ในครั้งเดียว
        await prisma.book.create({
            data: {
                // --- Book Fields ---
                title: bookTitle,
                searchKey: `${bookTitle.toLowerCase().replace(/\s+/g, '-')}-${faker.string.alphanumeric(4)}`, // สร้าง searchKey ที่ไม่ซ้ำกัน
                description: faker.lorem.paragraph(),
                // --- Denormalized Fields ---
                ratingCount,
                reviewCount: faker.number.int({ min: 0, max: ratingCount }),
                averageRating,
                oneStarCount,
                twoStarCount,
                threeStarCount,
                fourStarCount,
                fiveStarCount,
                // --- Relations (Nested Writes) ---
                Author: { // เชื่อมกับ Author ที่มีอยู่จริง
                    connect: { id: randomAuthor.id } 
                },
                edition: { // สร้าง Edition ใหม่ที่ผูกกับหนังสือเล่มนี้
                    create: {
                        isbn: faker.commerce.isbn(),
                        pages: faker.number.int({ min: 80, max: 1000 }),
                        publishedYear: parseInt(faker.date.past({ years: 10 }).getFullYear().toString()),
                        coverImage: faker.image.urlLoremFlickr({category: 'book'}),
                        isLatest: true,
                    }
                },
                bookTag: { // สร้าง Record ในตาราง BookTag เพื่อเชื่อมกับ Tags
                    create: randomTags.map(tag => ({
                        tag: {
                            connect: { id: tag.id }
                        }
                    }))
                }
            }
        });
    }

    console.log(`✅ Seeded ${NUM_BOOKS} books successfully.`);
}

main()
    .then(() => {
        console.log("🎉 Seeding process completed successfully!");
    })
    .catch((e) => {
        console.error("🔥 An error occurred during the seeding process:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("🔌 Disconnecting Prisma Client...");
        await prisma.$disconnect();
    });