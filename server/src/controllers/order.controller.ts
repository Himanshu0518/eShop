import { asyncHandler } from "../utils/utils";
import { Request, Response } from "express";
import razorpay from "../config/payment";
import crypto from "crypto";
import { prisma } from "../config/db";
import { request } from "http";


const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { productId, totalAmount, quantity } = req.body;
  const user = req.user;

  // Basic validation
  if (!productId || !totalAmount || !quantity) {
    return res.status(400).json({
      success: false,
      message: "productId, totalAmount and quantity are required",
    });
  }
   const USD_TO_INR = Number(process.env.USD_TO_INR) || 90 ;

  try {
    // 1️ Create Razorpay order
    const amountInPaise = Math.round(
  Number(totalAmount) * USD_TO_INR * 100
);

const razorpayOrder = await razorpay.orders.create({
  amount: amountInPaise,
  currency: "INR",
});


    // 2️ Create DB order linked with Razorpay order
    const dbOrder = await prisma.order.create({
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

  } catch (error: any) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error}`,
    });
  }
});

const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    //  Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
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
    await prisma.order.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "PAID",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  
    const user = req.user;
    try{
        const orders = await prisma.order.findMany({
            where:{
                userId:user.id
            },
            include:{
                product:true,
                user:true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json({
            success:true,
            message:"Orders fetched successfully",
            data:orders
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch orders: ${(error as Error).message}`,
        })
    }
})

const getPaymentKey = asyncHandler(async(_,res:Response)=>{


   const key_id = process.env.RAZORPAY_KEY_ID 

    return res.status(200)
    .json({
      key:key_id,
      success:true,
      message:'successfully received key'
    })
})


export {verifyPayment,createOrder, getAllOrders, getPaymentKey };