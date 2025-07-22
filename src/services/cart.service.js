import prisma from "../config/prisma.config.js";

export async function testGetCart () {
    return await prisma.user.findMany()
}