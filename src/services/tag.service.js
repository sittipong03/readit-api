import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function getAllTags() {
  return await prisma.tag.findMany();
}