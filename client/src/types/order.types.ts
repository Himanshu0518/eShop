
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}


export interface CreateOrderPayload {
  userId: number;
  cartItems: { productId: number; quantity: number }[];
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}
