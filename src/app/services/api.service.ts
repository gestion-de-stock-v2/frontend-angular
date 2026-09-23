import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api/v1';

  constructor(private http: HttpClient) {}

  // CATEGORIES
  getCategorias(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/categories`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  getCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/categories/${id}`);
  }
  createCategoria(c: any): Observable<any> {
    return this.http.post<any>(`${this.base}/categories`, c);
  }
  updateCategoria(id: number, c: any): Observable<any> {
    return this.http.put<any>(`${this.base}/categories/${id}`, c);
  }
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }

  // SUPPLIERS
  getFornecedores(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/suppliers`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  getFornecedor(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/suppliers/${id}`);
  }
  createFornecedor(f: any): Observable<any> {
    return this.http.post<any>(`${this.base}/suppliers`, f);
  }
  updateFornecedor(id: number, f: any): Observable<any> {
    return this.http.put<any>(`${this.base}/suppliers/${id}`, f);
  }
  deleteFornecedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/suppliers/${id}`);
  }

  // PRODUCTS
  getProdutos(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/products`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  getProduto(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/products/${id}`);
  }
  createProduto(p: any): Observable<any> {
    return this.http.post<any>(`${this.base}/products`, p);
  }
  updateProduto(id: number, p: any): Observable<any> {
    return this.http.put<any>(`${this.base}/products/${id}`, p);
  }
  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }

  // STOCK MOVEMENTS
  getMovimentacoes(produtoId?: number): Observable<any[]> {
    const url = produtoId
      ? `${this.base}/stock-movements/product/${produtoId}`
      : `${this.base}/stock-movements`;
    return this.http.get<any>(url).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  createMovimentacao(m: any): Observable<any> {
    return this.http.post<any>(`${this.base}/stock-movements`, m);
  }

  // ORDERS
  getOrders(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/orders`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  createOrder(o: any): Observable<any> {
    return this.http.post<any>(`${this.base}/orders`, o);
  }

  // CUSTOMERS
  getCustomers(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/customers`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  createCustomer(c: any): Observable<any> {
    return this.http.post<any>(`${this.base}/customers`, c);
  }
  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/customers/${id}`);
  }

  // USERS
  getUsers(): Observable<any[]> {
    return this.http.get<any>(`${this.base}/users`).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }
}
