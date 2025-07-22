import prisma from "../config/prisma.config.js";

export async function testGetUser () {
    return await prisma.user.findMany()
}