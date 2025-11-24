"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../config/db");
const addProduct = (0, utils_1.asyncHandler)(async (req, res) => {
    const { name, description, price, category, sizes, discount } = req.body;
    console.log("Request Body:", req.body);
    let imgLocalpath = req.file?.path;
    console.log("File path:", imgLocalpath);
    try {
        const uploadResult = await (0, utils_1.uploadToCloudinary)(imgLocalpath);
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
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newProduct
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
        const products = await db_1.prisma.product.findMany();
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
