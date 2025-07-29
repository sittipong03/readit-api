import prisma from "../src/config/prisma.config.js";
import bcrypt from "bcryptjs";
import 'dotenv/config'

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

async function seedDB(){
    await prisma.user.createMany({data : userData , skipDuplicates : true})
}

seedDB().then(console.log('DB seed successfull'))
    .catch(console.log)
    .finally(prisma.$disconnect())