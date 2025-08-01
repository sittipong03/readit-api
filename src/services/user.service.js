import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function testGetUser() {
  return await prisma.user.findMany();
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      reviewCount: true,
      followerCount: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}


export async function postAddressById(userid , data){
  return await prisma.userAddress.create({
    where:{userid},
    data
  })
}

export async function patchAddressById (userid , data){
  return await prisma.userAddress.update({
    where:{userid},
    data
  })
}