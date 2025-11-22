
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
