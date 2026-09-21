import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { IconComponent } from '../../components/icon/icon.component';
import { Product } from '../../models/product.model';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalCustomers = 0;
  totalOrders = 0;
  totalRevenue = 0;
  stockTotal = 0;
  lowStockProducts: Product[] = [];
  recentOrders: Order[] = [];
  loading = true;
  erro = '';

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;

    // Produits
    this.productService.findAll().subscribe({
      next: (d) => {
        this.totalProducts = d.length;
        this.stockTotal = d.reduce((sum, p) => sum + (p.availableQuantity || 0), 0);
        this.lowStockProducts = d
          .filter(p => (p.availableQuantity || 0) < 10)
          .sort((a, b) => (a.availableQuantity || 0) - (b.availableQuantity || 0))
          .slice(0, 5);
      },
      error: (e) => this.erro = e?.error?.message || 'Erreur produits'
    });

    // Clients
    this.customerService.findAll().subscribe({
      next: (d) => this.totalCustomers = d.length,
      error: (e) => this.erro = e?.error?.message || 'Erreur clients'
    });

    this.orderService.findAll().subscribe({
      next: (d) => {
        this.totalOrders = d.length;
        this.totalRevenue = d.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        this.recentOrders = d
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
        this.loading = false;
      },
      error: (e) => { this.erro = e?.error?.message || 'Erreur commandes'; this.loading = false; }
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
