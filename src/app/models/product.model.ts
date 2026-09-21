export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
  categoryId?: number;
  categoryName?: string;
}

export interface ProductPurchaseRequest {
  productId: number;
  quantity: number;
}

export interface ProductPurchaseResponse {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
