export interface OrderLine {
  id?: number;
  productId: number;
  quantity: number;
}

export interface Order {
  id?: number;
  reference: string;
  totalAmount: number;
  paymentMethod: string;
  customerId: number;
  lines: OrderLine[];
  createdAt?: string;
}

export interface OrderRequest {
  customerId: number;
  paymentMethod: string;
  lines: { productId: number; quantity: number }[];
}
