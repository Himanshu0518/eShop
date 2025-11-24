"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavourite = exports.removeFromFavorite = exports.getAllfavourite = exports.addToFavourite = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../config/db");
const addToFavourite = (0, utils_1.asyncHandler)(async (req, res) => {
    let { productId } = req.body;
    productId = Number(productId);
    const userId = Number(req.user.id);
    try {
        const item = await db_1.prisma.favorite.create({
            data: {
                userId: userId,
                productId: productId,
            }
        });
        return res.status(200).json({
            success: true,
            message: "Item added to favorite successfully",
            data: item
        });
    }
    catch (error) {
    }
});
exports.addToFavourite = addToFavourite;
const getAllfavourite = (0, utils_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.user.id);
    try {
        const favorites = await db_1.prisma.favorite.findMany({
            where: {
                userId: userId
            },
            include: {
                product: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Favorite items fetched successfully",
            data: favorites
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch favorite items: ${error.message}`,
        });
    }
});
exports.getAllfavourite = getAllfavourite;
const removeFromFavorite = (0, utils_1.asyncHandler)(async (req, res) => {
    const { favId } = req.params;
    try {
        await db_1.prisma.favorite.delete({
            where: {
                id: parseInt(favId)
            }
        });
        return res.status(200).json({
            success: true,
            message: "Item removed from favorite successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to remove item from favorite: ${error.message}`,
        });
    }
});
exports.removeFromFavorite = removeFromFavorite;
const toggleFavourite = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const userId = Number(req.user.id);
    try {
        const existingFavourite = await db_1.prisma.favorite.findFirst({
            where: {
                userId: userId,
                productId: Number(productId),
            },
        });
        if (existingFavourite) {
            await db_1.prisma.favorite.delete({
                where: {
                    id: existingFavourite.id,
                },
            });
            return res.status(200).json({
                success: true,
                message: "Item removed from favorite successfully",
            });
        }
        else {
            await db_1.prisma.favorite.create({
                data: {
                    userId: userId,
                    productId: Number(productId),
                },
            });
            return res.status(200).json({
                success: true,
                message: "Item added to favorite successfully",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to toggle favorite item: ${error.message}`,
        });
    }
});
exports.toggleFavourite = toggleFavourite;
