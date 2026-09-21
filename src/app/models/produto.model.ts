import { Categoria } from './categoria.model';
import { Fornecedor } from './fornecedor.model';

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoria?: Categoria;
  fornecedor?: Fornecedor;
}
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
