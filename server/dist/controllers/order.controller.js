"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlldBOrders = exports.getPaymentKey = exports.getAllOrders = exports.createOrder = exports.verifyPayment = void 0;
const utils_1 = require("../utils/utils");
const payment_1 = __importDefault(require("../config/payment"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const createOrder = (0, utils_1.asyncHandler)(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = req.user;
    // 1. Validate Product ID
    const parsedProductId = Number(productId);
    if (!productId || isNaN(parsedProductId) || parsedProductId <= 0) {
        return res.status(400).json({
            success: false,
            message: "A valid productId is required",
        });
    }
    // 2. Validate Quantity
    const parsedQuantity = quantity !== undefined ? Number(quantity) : 1;
    if (isNaN(parsedQuantity) || parsedQuantity < 1 || !Number.isInteger(parsedQuantity)) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a positive integer greater than or equal to 1",
        });
    }
    if (parsedQuantity > 100) {
        return res.status(400).json({
            success: false,
            message: "Quantity cannot exceed 100 items per order",
        });
    }
    // 3. Authoritative Price Calculation from Database
    const product = await db_1.prisma.product.findUnique({
        where: { id: parsedProductId },
    });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    // Apply product discount safely
    const discountPercentage = Math.max(0, Math.min(100, Number(product.discount) || 0));
    const unitPrice = product.price * (1 - discountPercentage / 100);
    const calculatedTotal = Number((unitPrice * parsedQuantity).toFixed(2));
    // Convert to currency subunits (INR paise) for Razorpay
    const USD_TO_INR = Number(process.env.USD_TO_INR) || 90;
    const amountInPaise = Math.round(calculatedTotal * USD_TO_INR * 100);
    if (amountInPaise < 100) {
        return res.status(400).json({
            success: false,
            message: "Calculated order amount must be at least 100 paise (₹1.00)",
        });
    }
    // =========================================================================
    // STEP 1: CREATE DB ORDER FIRST (status: "PENDING")
    // =========================================================================
    let dbOrder;
    try {
        dbOrder = await db_1.prisma.order.create({
            data: {
                userId: Number(user.id),
                productId: parsedProductId,
                quantity: parsedQuantity,
                totalPrice: calculatedTotal,
                status: "PENDING",
                // razorpayOrderId is null at this initial stage
            },
        });
    }
    catch (dbError) {
        console.error("Failed to create pending order in DB:", dbError);
        return res.status(500).json({
            success: false,
            message: "Failed to initialize order in database",
        });
    }
    // =========================================================================
    // STEP 2: CALL RAZORPAY SDK WITH INTERNAL DB ORDER ID IN RECEIPT & NOTES
    // =========================================================================
    let razorpayOrder;
    try {
        razorpayOrder = await payment_1.default.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_${dbOrder.id}`,
            notes: {
                dbOrderId: String(dbOrder.id),
                userId: String(user.id),
                productId: String(parsedProductId),
                quantity: String(parsedQuantity),
            },
        });
    }
    catch (gatewayError) {
        // Audit trail: If gateway call fails, mark the pending DB order as FAILED
        await db_1.prisma.order.update({
            where: { id: dbOrder.id },
            data: { status: "FAILED" },
        });
        console.error("Razorpay order creation failed:", gatewayError);
        return res.status(502).json({
            success: false,
            message: `Payment gateway initialization failed: ${gatewayError.message || gatewayError}`,
        });
    }
    // =========================================================================
    // STEP 3: UPDATE DB ORDER WITH RAZORPAY ORDER ID (status: "CREATED")
    // =========================================================================
    try {
        await db_1.prisma.order.update({
            where: { id: dbOrder.id },
            data: {
                razorpayOrderId: razorpayOrder.id,
                status: "CREATED",
            },
        });
    }
    catch (updateError) {
        console.error("Failed to link razorpayOrderId to DB order:", updateError);
        return res.status(500).json({
            success: false,
            message: "Order created with gateway, but failed to link with database",
        });
    }
    // =========================================================================
    // STEP 4: RETURN TO FRONTEND
    // =========================================================================
    return res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: {
            ...razorpayOrder,
            orderId: dbOrder.id,
            totalPrice: calculatedTotal,
            unitPrice: Number(unitPrice.toFixed(2)),
            quantity: parsedQuantity,
            USD_TO_INR,
        },
    });
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
        // Signature verification
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
        // Payment verified — update order idempotently
        const updated = await db_1.prisma.order.updateMany({
            where: {
                razorpayOrderId: razorpay_order_id,
                status: { in: ["CREATED", "PENDING"] },
            },
            data: {
                status: "PAID",
                razorpayPaymentId: razorpay_payment_id,
            },
        });
        return res.status(200).json({
            success: true,
            message: updated.count > 0 ? "Payment verified successfully" : "Payment already verified",
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
                userId: user.id,
            },
            include: {
                product: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
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
const getPaymentKey = (0, utils_1.asyncHandler)(async (_, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    return res.status(200).json({
        key: key_id,
        success: true,
        message: "successfully received key",
    });
});
exports.getPaymentKey = getPaymentKey;
// get all orders of all users
const getAlldBOrders = (0, utils_1.asyncHandler)(async (req, res) => {
    try {
        const orders = await db_1.prisma.order.findMany({
            include: {
                product: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to fetch orders: ${error.message}`,
        });
    }
});
exports.getAlldBOrders = getAlldBOrders;
