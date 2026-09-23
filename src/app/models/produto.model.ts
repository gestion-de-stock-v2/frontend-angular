export interface Produto {
  id?: number;
  name: string;
  description?: string;
  availableQuantity: number;
  price: number;
  categoryId?: number;
  categoryName?: string;
  categoryDescription?: string;
  supplierId?: number;
  supplierName?: string;
}
