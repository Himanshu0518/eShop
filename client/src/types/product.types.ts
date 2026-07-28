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

export interface PaginatedProductResponse {
  success: boolean;
  message: string;
  data: Product[];
  nextCursor: number | null;
  hasMore: boolean;
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

export interface WordEmbedding extends Product {
  embedding: number[];
}

export interface WordEmbeddingResponse  {
    sucess: boolean;
    message: string;
    data: WordEmbedding
}

export interface BulkEmbeddingResponse {
    sucess: boolean;
    message: string;
    data: {
       total: number ,
      successful: number,
      failed: number,
      errors: any[]
    }

}