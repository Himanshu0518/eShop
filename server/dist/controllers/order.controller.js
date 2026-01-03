"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.createOrder = exports.verifyPayment = void 0;
const utils_1 = require("../utils/utils");
const payment_1 = __importDefault(require("../config/payment"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const createOrder = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId, totalAmount, quantity } = req.body;
    const user = req.user;
    // Basic validation
    if (!productId || !totalAmount || !quantity) {
        return res.status(400).json({
            success: false,
            message: "productId, totalAmount and quantity are required",
        });
    }
    const USD_TO_INR = Number(process.env.USD_TO_INR) || 90;
    try {
        // 1️ Create Razorpay order
        const razorpayOrder = await payment_1.default.orders.create({
            amount: Number(totalAmount) * 100 * USD_TO_INR, // paise
            currency: "INR",
        });
        // 2️ Create DB order linked with Razorpay order
        const dbOrder = await db_1.prisma.order.create({
            data: {
                userId: Number(user.id),
                productId: Number(productId),
                quantity: Number(quantity),
                totalPrice: Number(totalAmount),
                razorpayOrderId: razorpayOrder.id,
                status: "CREATED",
            },
        });
        // 3️ Send Razorpay order details to frontend
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: {
                ...razorpayOrder,
                orderId: dbOrder.id,
                USD_TO_INR
            },
        });
    }
    catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${error.message}`,
        });
    }
});
exports.createOrder = createOrder;
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        if (!razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification fields",
            });
        }
        //  Signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(body)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
        //  Payment verified — update order
        await db_1.prisma.order.updateMany({
            where: { razorpayOrderId: razorpay_order_id },
            data: {
                status: "PAID",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.verifyPayment = verifyPayment;
const getAllOrders = (0, utils_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    try {
        const orders = await db_1.prisma.order.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch orders: ${error.message}`,
        });
    }
});
exports.getAllOrders = getAllOrders;
