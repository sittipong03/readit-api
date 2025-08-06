import * as productService from "../services/product.service.js";
import * as bookService from "../services/book.service.js";
import createError from "../utils/create-error.util.js";

export async function createProduct(req, res, next) {
    try {
        const { sku, price, productType, bookId } = req.body;
        console.log(sku);

        if (!sku || !price || !productType) {
            createError(400, "sku, price, and productType are required.");
        }

        if (bookId) {
            const bookExists = await bookService.getBookById(bookId); // เรียกใช้ service เพื่อค้นหาหนังสือ
            if (!bookExists) {
                return createError(404, "Book with the provided bookId not found.");
            }
        }

        const newProduct = await productService.createProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        next(error);
    }
}

export async function getAllProducts(req, res, next) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
}

export async function getProductById(req, res, next) {
    try {
        const { id } = req.params;
        let product = await productService.getProductById(id);
        // if(product == []){
        //     const mockBookId = ""
        //     product = await productService.getProductById(id);
        // }

        if (!product) {
            createError(404, "Product not found.");
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
}

export async function getProductByBookId(req, res, next) {
  try {
    const { bookId } = req.params;
    const product = await productService.getProductByBookId(bookId);

    if (!product) {
      createError(404 ,"No product found for this book ID." )
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            createError(400, "No update data provided.");
        }

        const updatedProduct = await productService.updateProduct(id, updateData);
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;

        const productExists = await productService.getProductById(id);
        if (!productExists) {
            createError(404, "Product not found.");
        }

        await productService.deleteProduct(id);
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        next(error);
    }
}