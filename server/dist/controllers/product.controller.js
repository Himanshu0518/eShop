"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAddWordEmbeddings = exports.addWordEmbedding = exports.getProductViews = exports.addProductView = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../config/db");
const embeddings_1 = require("../utils/embeddings");
const addProduct = (0, utils_1.asyncHandler)(async (req, res) => {
    const { name, description, price, category, sizes, discount } = req.body;
    let imgLocalpath = req.file?.path;
    if (!imgLocalpath) {
        return res.status(400).json({
            success: false,
            message: "Image is required"
        });
    }
    try {
        const uploadResult = await (0, utils_1.uploadToCloudinary)(imgLocalpath);
        // add word_embedding ---> description + category.join(' ) + name 
        const newProduct = await db_1.prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category: (0, utils_1.NormalizeString)(category),
                sizes: (0, utils_1.NormalizeString)(sizes),
                discount: parseFloat(discount),
                img: uploadResult.url,
            }
        });
        const text = `${description} ${category} ${name}`;
        const embeddings = await (0, embeddings_1.getEmbeddings)(text);
        const embedding = embeddings[0]['values'];
        console.log("dimensions ", embedding.length);
        const vector = `[${embedding.join(",")}]`;
        // Insert/update embedding using raw SQL
        await db_1.prisma.$executeRawUnsafe(`INSERT INTO "ProductEmbedding" ("productId", "embedding", "createdAt", "updatedAt")
    VALUES ($1, $2::vector, NOW(), NOW())
    ON CONFLICT ("productId") 
    DO UPDATE SET 
        "embedding" = EXCLUDED.embedding,
        "updatedAt" = NOW();`, newProduct.id, vector);
        const wordEmbedding = await db_1.prisma.productEmbedding.findFirst({
            where: {
                productId: newProduct.id
            }
        });
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: { ...newProduct, wordEmbedding }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to add product: ${error.message}`,
        });
    }
});
exports.addProduct = addProduct;
const getAllProducts = (0, utils_1.asyncHandler)(async (_, res) => {
    try {
        const products = await db_1.prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (0, utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await db_1.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch product: ${error.message}`,
        });
    }
});
exports.getProductById = getProductById;
const updateProduct = (0, utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, sizes, discount } = req.body;
    try {
        const existingProduct = await db_1.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const imgLocalpath = req.file?.path;
        let imgUrl = existingProduct.img;
        if (imgLocalpath) {
            const uploadResult = await (0, utils_1.uploadToCloudinary)(imgLocalpath);
            imgUrl = uploadResult.url;
        }
        const updatedProduct = await db_1.prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name ? name : existingProduct.name,
                description: description ? description : existingProduct.description,
                price: parseFloat(price) ? parseFloat(price) : existingProduct.price,
                category: category ? (0, utils_1.NormalizeString)(category) : existingProduct.category,
                sizes: sizes ? (0, utils_1.NormalizeString)(sizes) : existingProduct.sizes,
                discount: parseFloat(discount) ? parseFloat(discount) : existingProduct.discount,
                img: imgUrl,
            }
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to update product: ${error.message}`,
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (0, utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await db_1.prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to delete product: ${error.message}`,
        });
    }
});
exports.deleteProduct = deleteProduct;
const addProductView = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const existingProductView = await db_1.prisma.productView.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: Number(productId)
                }
            }
        });
        if (existingProductView) {
            return res.status(200).json({
                success: true,
                message: "Product view added successfully",
                data: existingProductView
            });
        }
        const productView = await db_1.prisma.productView.create({
            data: {
                productId: Number(productId),
                userId: Number(userId)
            }
        });
        return res.status(200).json({
            success: true,
            message: "Product view added successfully",
            data: productView
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to add product view: ${error.message}`,
        });
    }
});
exports.addProductView = addProductView;
const getProductViews = (0, utils_1.asyncHandler)(async (req, res) => {
    try {
        const productViews = await db_1.prisma.productView.findMany({
            include: {
                product: true
            },
            orderBy: {
                viewedAt: 'desc'
            },
            where: {
                userId: req.user.id
            }
        });
        return res.status(200).json({
            success: true,
            message: "Product views fetched successfully",
            data: productViews
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch product views: ${error.message}`,
        });
    }
});
exports.getProductViews = getProductViews;
const addWordEmbedding = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await db_1.prisma.product.findUnique({
            where: {
                id: parseInt(productId)
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const text = `${product.description} ${product.category} ${product.name}`;
        const embeddings = await (0, embeddings_1.getEmbeddings)(text);
        const embedding = embeddings[0]['values'];
        console.log("dimensions ", embedding.length);
        const vector = `[${embedding.join(",")}]`;
        // Insert/update embedding using raw SQL
        await db_1.prisma.$executeRawUnsafe(`INSERT INTO "ProductEmbedding" ("productId", "embedding", "createdAt", "updatedAt")
    VALUES ($1, $2::vector, NOW(), NOW())
    ON CONFLICT ("productId") 
    DO UPDATE SET 
        "embedding" = EXCLUDED.embedding,
        "updatedAt" = NOW();`, product.id, vector);
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: { ...product, embeddings }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to add word embedding: ${error.message}`,
        });
    }
});
exports.addWordEmbedding = addWordEmbedding;
const bulkAddWordEmbeddings = (0, utils_1.asyncHandler)(async (req, res) => {
    try {
        // Fetch all products without embeddings
        const products = await db_1.prisma.product.findMany({
            where: {
                embedding: null
            }
        });
        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All products already have embeddings",
                data: { processed: 0, total: 0 }
            });
        }
        let successCount = 0;
        let failedCount = 0;
        const errors = [];
        // Process products in batches to avoid overwhelming the API
        const batchSize = 5; // Process 5 at a time
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            // Process batch concurrently
            const batchPromises = batch.map(async (product) => {
                try {
                    const text = `${product.description} ${product.category} ${product.name}`;
                    const embeddings = await (0, embeddings_1.getEmbeddings)(text);
                    const embedding = embeddings[0]['values'];
                    const vector = `[${embedding.join(",")}]`;
                    await db_1.prisma.$executeRawUnsafe(`INSERT INTO "ProductEmbedding" ("productId", "embedding", "createdAt", "updatedAt")
                        VALUES ($1, $2::vector, NOW(), NOW())
                        ON CONFLICT ("productId") 
                        DO UPDATE SET 
                            "embedding" = EXCLUDED.embedding,
                            "updatedAt" = NOW();`, product.id, vector);
                    successCount++;
                    console.log(`✓ Processed product ${product.id}: ${product.name}`);
                }
                catch (error) {
                    failedCount++;
                    errors.push({
                        productId: product.id,
                        productName: product.name,
                        error: error.message
                    });
                    console.error(`✗ Failed product ${product.id}:`, error.message);
                }
            });
            await Promise.all(batchPromises);
            // Optional: Add a small delay between batches to avoid rate limiting
            if (i + batchSize < products.length) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            }
        }
        return res.status(200).json({
            success: true,
            message: "Bulk embedding generation completed",
            data: {
                total: products.length,
                successful: successCount,
                failed: failedCount,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to bulk add word embeddings: ${error.message}`,
        });
    }
});
exports.bulkAddWordEmbeddings = bulkAddWordEmbeddings;
