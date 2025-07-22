import prisma from "../config/prisma.config.js";

export async function testGetReview () {
    return await prisma.user.findMany()
}