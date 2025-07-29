import prisma from "../src/config/prisma.config.js";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import fs from 'fs';


const hashPassword = bcrypt.hashSync("123456" ,10)

const userData = [
    {
    "email": "buzz.l@example.com",
    "password": hashPassword,
    "name": "Buzz Lightyear",
    "role": "USER",
    "emailVerified": true,
    "reviewCount": 98,
    "followerCount": 152,
    "createdAt": "2024-11-15T09:15:00.000Z",
    "updatedAt": "2025-07-21T14:00:00.000Z",
  },
  // --- ตัวอย่างที่ 2: ผู้ดูแลระบบ (Admin) ---
  {
    "email": "admin@readit.net",
    "password": hashPassword,
    "name": "Admin",
    "role": "ADMIN", // สมมติว่ามี Role นี้ใน Enum
    "emailVerified": true,
    "reviewCount": 2,
    "followerCount": 5,
    "createdAt": "2023-01-20T08:00:00.000Z",
    "updatedAt": "2025-06-30T18:45:00.000Z",

  },
  // --- ตัวอย่างที่ 3: ผู้ใช้งานใหม่ที่ยังไม่ยืนยันอีเมล ---
  {
    "email": "slinky.d@example.com",
    "password": hashPassword,
    "name": "Slinky Dog",
    "role": "USER",
    "emailVerified": true,
    "reviewCount": 0,
    "followerCount": 0,
    "createdAt": "2025-07-22T16:30:15.000Z",
    "updatedAt": "2025-07-22T16:30:15.000Z",
  }
]

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

// try seed from Ai :
// async function testRun(){
// const tagIds = [
//     'cmdfs9z7k00169kqazfarf1n6', 'cmdfs9z7k00159kqam0nxsa8e', 'cmdfs9z7k00149kqaaqt8xyqx',
//     'cmdfs9z7k00139kqay3w43hzh', 'cmdfs9z7k00129kqa00kow0v4', 'cmdfs9z7k00119kqag90yn6j3',
//     'cmdfs9z7k00109kqaynvp6q8h', 'cmdfs9z7k000z9kqa6sycv6a4', 'cmdfs9z7k000y9kqa1ku7wgpd',
//     'cmdfs9z7k000x9kqa2fqdfcaa', 'cmdfs9z7k000w9kqazjjvkzxo', 'cmdfs9z7k000v9kqamxdfph2u',
//     'cmdfs9z7k000u9kqapuwdrxve', 'cmdfs9z7k000t9kqayaosvejz', 'cmdfs9z7k000s9kqa563ns3jz',
//     'cmdfs9z7k000r9kqat7gx4ccz', 'cmdfs9z7k000q9kqalruspd8r', 'cmdfs9z7k000p9kqann0cwnl9',
//     'cmdfs9z7k000o9kqa45caxsa1', 'cmdfs9z7k000n9kqa0hic5up5', 'cmdfs9z7k000m9kqa0lrgk5hp',
//     'cmdfs9z7k000l9kqa61zkchwn', 'cmdfs9z7k000k9kqa0yw9d7zq', 'cmdfs9z7k000j9kqa1wt05ds6',
//     'cmdfs9z7k000i9kqa6027ybc5', 'cmdfs9z7k000h9kqaw98v1x6c', 'cmdfs9z7k000g9kqa8vfdbxmm',
//     'cmdfs9z7k000f9kqayp5dr7vj', 'cmdfs9z7k000e9kqa8apdjrgq', 'cmdfs9z7k000d9kqav3pz2rbd',
//     'cmdfs9z7k000c9kqasokau9on', 'cmdfs9z7k000b9kqaj0nmh470', 'cmdfs9z7k000a9kqa5bp86y5n',
//     'cmdfs9z7k00099kqavy8rwu6l', 'cmdfs9z7k00089kqa9vpfu6l4', 'cmdfs9z7k00079kqa1gfkt4bh',
//     'cmdfs9z7k00069kqaygv2wwrx', 'cmdfs9z7k00059kqax1mv5fvl', 'cmdfs9z7k00049kqanc68zv3q',
//     'cmdfs9z7k00039kqaggg6brx9'
// ];

// const NUM_AUTHORS = 20;
// const NUM_BOOKS = 50;

// /**
//  * ## 🧑‍🎨 สร้างข้อมูลนักเขียน (Authors)
//  */
// const authors = [];
// for (let i = 0; i < NUM_AUTHORS; i++) {
//     authors.push({
//         author_id: faker.string.uuid(),
//         name: faker.person.fullName(),
//         bio: faker.person.bio(),
//         profile_image: faker.image.avatar(),
//         created_at: faker.date.past({ years: 5 }),
//         updated_at: new Date()
//     });
// }

// /**
//  * ## 📚 สร้างข้อมูลหนังสือ (Books) และข้อมูลที่เกี่ยวข้อง
//  */
// const books = [];
// const editions = [];
// const bookTags = [];

// for (let i = 0; i < NUM_BOOKS; i++) {
//     const bookId = faker.string.uuid();
//     const selectedAuthor = faker.helpers.arrayElement(authors);
    
//     // --- สร้างข้อมูล rating แบบสมจริง ---
//     const five_star_count = faker.number.int({ min: 5, max: 1000 });
//     const four_star_count = faker.number.int({ min: 5, max: 800 });
//     const three_star_count = faker.number.int({ min: 2, max: 500 });
//     const two_star_count = faker.number.int({ min: 1, max: 100 });
//     const one_star_count = faker.number.int({ min: 0, max: 50 });
    
//     const rating_count = five_star_count + four_star_count + three_star_count + two_star_count + one_star_count;
//     const total_score = (5 * five_star_count) + (4 * four_star_count) + (3 * three_star_count) + (2 * two_star_count) + (1 * one_star_count);
//     const rating_avg = rating_count > 0 ? parseFloat((total_score / rating_count).toFixed(2)) : 0;

//     books.push({
//         book_id: bookId,
//         author_id: selectedAuthor.author_id,
//         title: faker.book.title(),
//         description: faker.lorem.sentence({ min: 25, max: 50 }).replace('.', ''),
//         search_key: null, // สามารถสร้าง search key จาก title ทีหลังได้
//         rating_count: rating_count,
//         review_count: faker.number.int({ min: 0, max: rating_count }),
//         rating_avg: rating_avg,
//         five_star_count,
//         four_star_count,
//         three_star_count,
//         two_star_count,
//         one_star_count,
//         created_at: faker.date.past({ years: 5 }),
//         updated_at: new Date()
//     });

//     // --- 📖 สร้าง Edition สำหรับหนังสือเล่มนี้ (อย่างน้อย 1 edition) ---
//     editions.push({
//         edition_id: faker.string.uuid(),
//         book_id: bookId,
//         isbn: faker.commerce.isbn(),
//         pages: faker.number.int({ min: 80, max: 1000 }),
//         published_year: faker.date.past({ years: 10 }).getFullYear().toString(),
//         is_latest: true,
//         created_at: faker.date.recent(),
//         updated_at: new Date()
//     });

//     // --- 🏷️ สร้าง Tags สำหรับหนังสือเล่มนี้ (สุ่ม 1-4 tags) ---
//     const numberOfTags = faker.number.int({ min: 1, max: 4 });
//     const selectedTags = faker.helpers.arrayElements(tagIds, numberOfTags);
    
//     for (const tagId of selectedTags) {
//         bookTags.push({
//             book_tag_id: faker.string.uuid(),
//             book_id: bookId,
//             tag_id: tagId
//         });
//     }
// }


// // --- 💾 บันทึกข้อมูลเป็นไฟล์ JSON ---
// const dataToSave = {
//     authors,
//     books,
//     editions,
//     bookTags
// };

// fs.writeFileSync('mock-data.json', JSON.stringify(dataToSave, null, 2));

// console.log(`✅ สร้างข้อมูลเรียบร้อยแล้ว!`);
// console.log(`🧑‍🎨 ${authors.length} Authors`);
// console.log(`📚 ${books.length} Books`);
// console.log(`📖 ${editions.length} Editions`);
// console.log(`🏷️ ${bookTags.length} Book-Tag relationships`);
// console.log(`\nไฟล์ถูกบันทึกในชื่อ mock-data.json`);
// }
// testRun()

async function seedDB(){
    await prisma.user.createMany({data : userData , skipDuplicates : true})
    await prisma.tag.createMany({data : tagData , skipDuplicates : true})

}

seedDB().then(console.log('DB seed successfull'))
    .catch(console.log)
    .finally(prisma.$disconnect())