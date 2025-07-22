import prisma from "../config/prisma.config.js";

export async function testGetBook () {
    return await prisma.user.findMany()
}