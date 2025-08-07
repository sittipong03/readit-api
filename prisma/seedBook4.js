import prisma from "../src/config/prisma.config.js";
import bcrypt from "bcryptjs";

// --- 🔐 ค่าพื้นฐาน ---
const hashPassword = bcrypt.hashSync("123456", 10);

// --- 🧑‍💻 ข้อมูลผู้ใช้ที่ต้องการ Seed ---
const userData = [
  {
    email: "buzz.l@example.com",
    password: hashPassword,
    name: "Buzz Lightyear",
    role: "USER",
    emailVerified: true,
    reviewCount: 98,
    followerCount: 152,
    createdAt: "2024-11-15T09:15:00.000Z",
    updatedAt: "2025-07-21T14:00:00.000Z",
  },
  {
    email: "admin@readit.net",
    password: hashPassword,
    name: "Admin",
    role: "ADMIN",
    emailVerified: true,
    reviewCount: 2,
    followerCount: 5,
    createdAt: "2023-01-20T08:00:00.000Z",
    updatedAt: "2025-06-30T18:45:00.000Z",
  },
  {
    email: "slinky.d@example.com",
    password: hashPassword,
    name: "Slinky Dog",
    role: "USER",
    emailVerified: true,
    reviewCount: 0,
    followerCount: 0,
    createdAt: "2025-07-22T16:30:15.000Z",
    updatedAt: "2025-07-22T16:30:15.000Z",
  }
];

// --- 🏷️ ข้อมูลแท็กที่ต้องการ Seed ---
const tagData = [
  {
    name: 'Art',
    description: 'หนังสือที่รวบรวมผลงาน หรือให้ความรู้ด้านทัศนศิลป์ เช่น ประวัติศาสตร์ศิลปะ, เทคนิคการวาดภาพ, การออกแบบ'
  },
  {
    name: 'Biography',
    description: 'หนังสือที่เล่าเรื่องราวชีวิตจริงของบุคคลใดบุคคลหนึ่ง ตั้งแต่เกิดจนถึงช่วงเวลาสำคัญต่างๆ'
  },
  {
    name: 'Business',
    description: 'หนังสือที่ให้ความรู้และกลยุทธ์ในการทำธุรกิจ การตลาด การบริหารการเงิน และการลงทุน'
  },
  {
    name: 'Chick Lit',
    description: 'นวนิยายที่สะท้อนชีวิตผู้หญิงยุคใหม่ในเมือง เน้นเรื่องความสัมพันธ์ การทำงาน และการค้นหาตัวเอง'
  },
  {
    name: 'Children\'s',
    description: 'หนังสือสำหรับเด็ก มีเนื้อหาหลากหลายตั้งแต่นิทานภาพไปจนถึงวรรณกรรม เพื่อส่งเสริมการอ่านและจินตนาการ'
  },
  {
    name: 'Christian',
    description: 'หนังสือที่เกี่ยวกับหลักคำสอน ความเชื่อ และเรื่องราวต่างๆ ในศาสนาคริสต์'
  },
  {
    name: 'Classics',
    description: 'หนังสือวรรณกรรมที่ทรงคุณค่าและได้รับการยอมรับในระดับสากล ผ่านการพิสูจน์ของกาลเวลา'
  },
  {
    name: 'Comics',
    description: 'หนังสือการ์ตูนช่องสไตล์ตะวันตก ที่เล่าเรื่องราวผ่านภาพวาดและคำพูดเป็นหลัก'
  },
  {
    name: 'Contemporary',
    description: 'นวนิยายที่ดำเนินเรื่องในยุคสมัยปัจจุบัน สะท้อนภาพสังคมและวิถีชีวิตของคนในยุคนั้นๆ'
  },
  {
    name: 'Cookbooks',
    description: 'หนังสือที่รวบรวมสูตรและขั้นตอนการทำอาหาร ทั้งของคาว ของหวาน และเครื่องดื่ม'
  },
  {
    name: 'Crime',
    description: 'หนังสือที่เน้นเรื่องราวอาชญากรรม การสืบสวนหาตัวคนร้าย และกระบวนการทางกฎหมาย'
  },
  {
    name: 'Ebooks',
    description: 'หนังสือในรูปแบบดิจิทัล (ไฟล์) สำหรับอ่านบนอุปกรณ์อิเล็กทรอนิกส์ต่างๆ'
  },
  {
    name: 'Fantasy',
    description: 'นวนิยายที่มีฉากอยู่ในโลกจินตนาการ ประกอบด้วยเวทมนตร์ สิ่งมีชีวิตเหนือจริง และการผจญภัย'
  },
  {
    name: 'Fiction',
    description: 'หนังสือที่สร้างจากจินตนาการของผู้เขียนทั้งหมด ไม่ว่าจะเป็นนวนิยายหรือเรื่องสั้น'
  },
  {
    name: 'Gay and Lesbian',
    description: 'หนังสือที่บอกเล่าเรื่องราวความรักและชีวิตของตัวละครที่มีความหลากหลายทางเพศ (LGBTQ+)'
  },
  {
    name: 'Graphic Novels',
    description: 'หนังสือการ์ตูนที่มีเนื้อเรื่องยาวและซับซ้อนจบในเล่มเดียว เหมือนการอ่านนวนิยายผ่านภาพ'
  },
  {
    name: 'Historical Fiction',
    description: 'นวนิยายที่มีตัวละครและเรื่องราวที่แต่งขึ้นใหม่ แต่อยู่ในฉากหลังของเหตุการณ์ประวัติศาสตร์จริง'
  },
  {
    name: 'History',
    description: 'หนังสือที่เล่าข้อเท็จจริงเกี่ยวกับเหตุการณ์ บุคคล หรือยุคสมัยต่างๆ ที่เกิดขึ้นในอดีต'
  },
  {
    name: 'Horror',
    description: 'หนังสือที่สร้างบรรยากาศน่ากลัว กดดัน และสยองขวัญ ทำให้ผู้อ่านรู้สึกหวาดผวา'
  },
  {
    name: 'Humor and Comedy',
    description: 'หนังสือที่เน้นสร้างความสนุกสนานและเสียงหัวเราะ ผ่านเรื่องราวหรือมุกตลกต่างๆ'
  },
  {
    name: 'Manga',
    description: 'หนังสือการ์ตูนช่องจากประเทศญี่ปุ่น มีลายเส้นและสไตล์การเล่าเรื่องที่เป็นเอกลักษณ์'
  },
  {
    name: 'Memoir',
    description: 'หนังสือที่ผู้เขียนเล่าเรื่องราวจากประสบการณ์จริงของตนเอง โดยเน้นช่วงเวลาที่น่าจดจำเป็นพิเศษ'
  },
  {
    name: 'Music',
    description: 'หนังสือที่ให้ความรู้เกี่ยวกับดนตรี ไม่ว่าจะเป็นประวัติศาสตร์ ทฤษฎี หรือชีวประวัติศิลปิน'
  },
  {
    name: 'Mystery',
    description: 'หนังสือที่เต็มไปด้วยปริศนาลึกลับ ผู้อ่านจะต้องร่วมไขคดีหรือค้นหาความจริงไปพร้อมกับตัวละคร'
  },
  {
    name: 'Nonfiction',
    description: 'หนังสือที่เขียนจากเรื่องจริง ให้ความรู้ หรือข้อมูลตามข้อเท็จจริง (ตรงข้ามกับ Fiction)'
  },
  {
    name: 'Paranormal',
    description: 'หนังสือที่เกี่ยวกับปรากฏการณ์เหนือธรรมชาติ เช่น วิญญาณ ภูตผี หรือผู้มีพลังพิเศษ'
  },
  {
    name: 'Philosophy',
    description: 'หนังสือที่ชวนให้ขบคิดและตั้งคำถามเกี่ยวกับแนวคิดพื้นฐานของชีวิต ความจริง และการมีอยู่'
  },
  {
    name: 'Poetry',
    description: 'หนังสือที่ถ่ายทอดอารมณ์และความคิดผ่านการใช้ภาษาที่สละสลวยในรูปแบบของบทกวี'
  },
  {
    name: 'Psychology',
    description: 'หนังสือที่อธิบายการทำงานของจิตใจและความคิดที่ส่งผลต่อพฤติกรรมของมนุษย์'
  },
  {
    name: 'Religion',
    description: 'หนังสือที่ให้ความรู้เกี่ยวกับหลักคำสอน ประวัติ และความเชื่อของศาสนาต่างๆ'
  },
  {
    name: 'Romance',
    description: 'นวนิยายที่เน้นเรื่องราวความสัมพันธ์และความรักของตัวละครเป็นหัวใจสำคัญของเรื่อง'
  },
  {
    name: 'Science',
    description: 'หนังสือที่อธิบายความรู้และทฤษฎีทางวิทยาศาสตร์แขนงต่างๆ ให้เข้าใจได้ง่าย'
  },
  {
    name: 'Science Fiction',
    description: 'นวนิยายที่ผสานจินตนาการเข้ากับหลักการวิทยาศาสตร์ อาจเป็นเรื่องในโลกอนาคต อวกาศ หรือต่างดาว'
  },
  {
    name: 'Self Help',
    description: 'หนังสือที่ให้คำแนะนำและเครื่องมือเพื่อช่วยให้ผู้อ่านพัฒนาและปรับปรุงชีวิตของตนเองให้ดีขึ้น'
  },
  {
    name: 'Suspense',
    description: 'หนังสือที่ดำเนินเรื่องอย่างตึงเครียด ทำให้ผู้อ่านรู้สึกกดดันและลุ้นระทึกไปกับชะตากรรมของตัวละคร'
  },
  {
    name: 'Spirituality',
    description: 'หนังสือที่สำรวจความหมายของชีวิตและสัจธรรมภายในจิตใจ โดยไม่จำเป็นต้องอิงกับศาสนาใดศาสนาหนึ่ง'
  },
  {
    name: 'Sports',
    description: 'หนังสือที่เล่าเรื่องราวเกี่ยวกับโลกของกีฬา ไม่ว่าจะเป็นชีวประวัติคนดัง หรือเบื้องหลังการแข่งขัน'
  },
  {
    name: 'Thriller',
    description: 'หนังสือที่เดินเรื่องเร็วและตื่นเต้น มักมีการไล่ล่า การหนีเอาตัวรอด และอันตรายถึงชีวิต'
  },
  {
    name: 'Travel',
    description: 'หนังสือที่สร้างแรงบันดาลใจในการเดินทาง ผ่านบันทึกประสบการณ์หรือการแนะนำสถานที่ท่องเที่ยว'
  },
  {
    name: 'Young Adult',
    description: 'หนังสือสำหรับวัยรุ่น (YA) ที่มีเนื้อหาเข้มข้นสะท้อนปัญหาและการก้าวผ่านช่วงวัยของตัวละคร'
  }
];


/**
 * ฟังก์ชันหลักในการ Seed ข้อมูลลงฐานข้อมูล
 */
async function seedDatabase() {
  console.log("🌱 Starting to seed the database...");

  // --- 🧹 ล้างข้อมูลเก่าเพื่อให้เริ่มต้นใหม่เสมอ ---
  // (ใส่ comment ไว้ก่อน หากไม่ต้องการให้ลบข้อมูลทุกครั้ง)
  // await prisma.user.deleteMany();
  // await prisma.tag.deleteMany();
  // console.log("🗑️ Old data cleared.");

  // --- 1. Seed ข้อมูล User ---
  console.log(`🧑‍💻 Seeding ${userData.length} users...`);
  await prisma.user.createMany({
    data: userData,
    skipDuplicates: true, // ข้ามรายการที่มี email ซ้ำ
  });
  console.log("✅ Users seeded successfully.");

  // --- 2. Seed ข้อมูล Tag ---
  console.log(`🏷️ Seeding ${tagData.length} tags...`);
  await prisma.tag.createMany({
    data: tagData,
    skipDuplicates: true, // ข้ามรายการที่มี name ซ้ำ
  });
  console.log("✅ Tags seeded successfully.");
}

// --- 🚀 รันฟังก์ชัน Seed และจัดการผลลัพธ์ ---
seedDatabase()
  .then(() => {
    console.log("🎉 Database seeding completed successfully!");
  })
  .catch((error) => {
    console.error("❌ An error occurred during database seeding:", error);
  })
  .finally(async () => {
    // --- ปิดการเชื่อมต่อ Prisma Client ---
    await prisma.$disconnect();
  });