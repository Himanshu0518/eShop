import type{ Product } from './product.types';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;     // include product in API
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: CartItem[];
}
