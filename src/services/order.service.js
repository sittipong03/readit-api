import prisma from "../config/prisma.config.js";

export async function testGetOrder () {
    return await prisma.user.findMany()
}