export type MovementType = 'ENTRY' | 'EXIT';

export interface Movimentacao {
  id?: number;
  productId: number;
  type: MovementType;
  quantity: number;
  note?: string;
  createdAt?: string;
  productName?: string;
  availableQuantityAfter?: number;
}
