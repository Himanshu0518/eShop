import type {User} from './user.types'
import type {Product} from './product.types'

export interface OrderDb {
  id  : number ; 
  totalPrice : number ;  
  createdAt: string;
  updatedAt: string;
  quantity : number  
  razorpayOrderId : string ;
  status : string ;  // created or paid 
  user   ?  : User   
  product  ? : Product
}



export interface Order {
  id  : number ; 
  totalPrice : number ;  
  createdAt: string;
  updatedAt: string;
  quantity : number  
  razorpayOrderId : string ;
  status : string ;
  user   ?  : User   
  product  ? : Product
}



export interface CreateOrderPayload {
 productId:number ;
 totalAmount : number ;
 quantity ? :number ;
}

export interface RazorpayOrderData {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: "order";
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string | null;
  status: "created";
  orderId: number;
  USD_TO_INR: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: RazorpayOrderData;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface PaymentKeyResponse{
  success: boolean;
  message: string;
  key:string 
}