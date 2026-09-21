export interface Payment {
  id?: number;
  amount: number;
  paymentMethod: string;
  orderReference: string;
  customerFirstname?: string;
  customerLastname?: string;
  customerEmail?: string;
  createdAt?: string;
}

export interface PaymentRequest {
  amount: number;
  paymentMethod: string;
  orderReference: string;
  customerFirstname?: string;
  customerLastname?: string;
  customerEmail?: string;
}
