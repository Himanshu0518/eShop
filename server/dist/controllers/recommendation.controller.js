"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendationByUserHistory = exports.getRecommendationByQuery = exports.getReccomendationByProduct = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../config/db");
const embeddings_1 = require("../utils/embeddings");
exports.getReccomendationByProduct = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    try {
        const productEmbed = await db_1.prisma.$queryRawUnsafe(`
    SELECT * FROM "ProductEmbedding" 
    WHERE "productId" = ${productId}
`);
        const recommendedProducts = await db_1.prisma.$queryRawUnsafe(`
            SELECT p.*
            FROM "ProductEmbedding" pe
            JOIN "Product" p ON p.id = pe."productId"
            WHERE pe."productId" != ${productId}
            ORDER BY pe.embedding <=> '${productEmbed[0].embedding}'::vector
            LIMIT 4;
        `);
        return res.status(200).json({
            success: true,
            data: recommendedProducts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        });
    }
});
exports.getRecommendationByQuery = (0, utils_1.asyncHandler)(async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({
            success: false,
            message: `Query is required`,
        });
    }
    try {
        const embeddings = await (0, embeddings_1.getEmbeddings)(String(query));
        const queryEmbedding = embeddings[0].values;
        //  convert array → pgvector format
        const vectorStr = `[${queryEmbedding.join(',')}]`;
        const recommendedProducts = await db_1.prisma.$queryRawUnsafe(`
            SELECT p.*
            FROM "ProductEmbedding" pe
            JOIN "Product" p ON p.id = pe."productId"
            ORDER BY pe.embedding <=> '${vectorStr}'::vector
            LIMIT 10
        `);
        return res.status(200).json({
            success: true,
            data: recommendedProducts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        });
    }
});
exports.getRecommendationByUserHistory = (0, utils_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    try {
        const cartItems = await db_1.prisma.cartItem.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 4
        });
        const favoriteItems = await db_1.prisma.favorite.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 4
        });
        let text = '';
        cartItems.forEach((item) => {
            text += item.product.name + ' ' + item.product.description + ' ' + item.product.category + ' ';
        });
        favoriteItems.forEach((item) => {
            text += item.product.name + ' ' + item.product.description + ' ' + item.product.category + ' ';
        });
        if (!text.trim()) {
            return res.status(200).json({
                success: true,
                message: `No favorite and cart items found for user ${user.id}`,
                data: []
            });
        }
        const embeddings = await (0, embeddings_1.getEmbeddings)(text);
        const queryEmbedding = embeddings[0].values;
        const vectorStr = `[${queryEmbedding.join(',')}]`;
        let recommendedProducts = await db_1.prisma.$queryRawUnsafe(`
            SELECT p.*
            FROM "ProductEmbedding" pe
            JOIN "Product" p ON p.id = pe."productId"
            ORDER BY pe.embedding <=> '${vectorStr}'::vector
            LIMIT 10
        `);
        // remove items if user has already placed in cart 
        recommendedProducts = recommendedProducts.filter((product) => {
            return !cartItems.some((item) => item.product.id === product.id);
        });
        return res.status(200).json({
            success: true,
            data: recommendedProducts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        });
    }
});
