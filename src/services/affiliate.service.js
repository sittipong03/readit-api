import prisma from "../config/prisma.config.js";

export async function testGetAffiliate () {
    return await prisma.user.findMany()
}