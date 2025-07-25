import prisma from "../config/prisma.config.js";

export async function testGetUser() {
  return await prisma.user.findMany();
}

export async function createNewUser(name, email, hashPassword) {
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });
}

export async function getUserByEmail(email) {
  const user = prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  console.log("Found user:", user);
  return user;
}
