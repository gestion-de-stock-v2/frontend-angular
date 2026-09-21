import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { Order, OrderRequest } from '../../models/order.model';
import { Customer } from '../../models/customer.model';
import { Product } from '../../models/product.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  showForm = false;
  loading = false;
  erro = '';
  success = '';

  selectedCustomerId: number | null = null;
  paymentMethod = 'CREDIT_CARD';
  lines: { productId: number | null; quantity: number }[] = [{ productId: null, quantity: 1 }];

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.customerService.findAll().subscribe(d => this.customers = d);
    this.productService.findAll().subscribe(d => this.products = d);
  }

  carregar(): void {
    this.orderService.findAll().subscribe({
      next: d => this.orders = d,
      error: (e: HttpErrorResponse) => this.erro = e?.error?.message || 'Erreur'
    });
  }

  addLine(): void { this.lines.push({ productId: null, quantity: 1 }); }
  removeLine(i: number): void { this.lines.splice(i, 1); }

  get total(): number {
    return this.lines.reduce((sum, l) => {
      const p = this.products.find(x => x.id === l.productId);
      return sum + (p ? p.price * l.quantity : 0);
    }, 0);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.reset();
  }

  reset(): void {
    this.selectedCustomerId = null;
    this.paymentMethod = 'CREDIT_CARD';
    this.lines = [{ productId: null, quantity: 1 }];
    this.erro = '';
    this.success = '';
  }

  submit(): void {
    this.erro = '';
    this.success = '';
    if (!this.selectedCustomerId) { this.erro = 'Sélectionnez un client'; return; }
    const validLines = this.lines.filter(l => l.productId && l.quantity > 0);
    if (validLines.length === 0) { this.erro = 'Ajoutez au moins un produit'; return; }

    const req: OrderRequest = {
      customerId: this.selectedCustomerId,
      paymentMethod: this.paymentMethod,
      lines: validLines.map(l => ({ productId: l.productId!, quantity: l.quantity }))
    };

    this.loading = true;
    this.orderService.create(req).subscribe({
      next: (o) => {
        this.loading = false;
        this.success = `Commande ${o.reference || o.id} créée`;
        this.showForm = false;
        this.reset();
        this.carregar();
        this.productService.findAll().subscribe(d => this.products = d);
      },
      error: (e: HttpErrorResponse) => { this.loading = false; this.erro = e?.error?.message || 'Erreur'; }
    });
  }
}
