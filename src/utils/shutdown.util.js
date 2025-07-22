import prisma from "../config/prisma.config.js";

export default async function (signal, err) {
  console.log(`\nReceive ${signal}, shutting down...`);

  if (err) {
    console.error("Unhandled Error:", err);
  }

  try {
    console.log("Prisma disconnecting...");
    await prisma.$disconnect();
    console.log("Prisma disconnected! :)");
  } catch (err) {
    console.log("Error while Prisma disconnecting!", err);
  } finally {
    process.exit(err ? 1 : 0);
  }
}
