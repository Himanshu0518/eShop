import type{ Product } from "./product.types";

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: Product;
}

export interface FavoritePayload {
  productId: number;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
  data: Favorite[];
}