import type{ User } from "./user.types";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount: number;
  img?: string;
  category: string[];
  sizes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductView{
    id: number;
    productId: number;
    userId: number;
    user?: User;
    product: Product;
    viewedAt: string
}


export interface ProductViewResponse {
  success: boolean;
  message: string;
  data: ProductView[];
}
