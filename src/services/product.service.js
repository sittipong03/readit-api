import prisma from "../config/prisma.config.js";

export async function createProduct(productData) {
    if (productData.price !== undefined && productData.price !== null) {
        const priceAsNumber = Number(productData.price);
        // toFixed(2) จะคืนค่าเป็น String, เราจึงแปลงกลับเป็น Number อีกครั้ง
        productData.price = Number(priceAsNumber.toFixed(2));
    }
    return await prisma.product.create({
        data: productData,
    });
}


export async function getAllProducts() {
    return await prisma.product.findMany({
        include: {
            book: {
                select: {
                    id: true,
                    title: true,
                    Author: { select: { name: true } },
                },
            },
        },
    });
}

export async function getProductById(productId) {
    return await prisma.product.findUnique({
        where: { id: productId },
        include: {
            book: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    averageRating: true,
                    Author: { select: { name: true } },
                },
            },
        },
    });
}

export async function getProductByBookId(bookId) {
  return await prisma.product.findUnique({
    where: { bookId: bookId }, // ค้นหาจาก field bookId ที่เป็น unique
  });
}

export async function updateProduct(productId, updateData) {
    if (updateData.price !== undefined && updateData.price !== null) {
        const priceAsNumber = Number(updateData.price);
        updateData.price = Number(priceAsNumber.toFixed(2));
    }
    return await prisma.product.update({
        where: { id: productId },
        data: updateData,
    });
}


export async function deleteProduct(productId) {
    return await prisma.product.delete({
        where: { id: productId },
    });
}