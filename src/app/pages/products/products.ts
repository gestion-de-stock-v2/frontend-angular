import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  searchTerm = '';
  loading = true;
  erro = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.erro = '';
    this.productService.findAll().subscribe({
      next: (d: Product[]) => { this.products = d; this.applyFilter(); this.loading = false; },
      error: (e: HttpErrorResponse) => { this.erro = e?.error?.message || 'Erreur'; this.loading = false; }
    });
  }

  applyFilter(): void {
    const t = this.searchTerm.toLowerCase().trim();
    this.filtered = !t ? this.products : this.products.filter(p =>
      p.name?.toLowerCase().includes(t) ||
      p.description?.toLowerCase().includes(t) ||
      p.categoryName?.toLowerCase().includes(t)
    );
  }

  getStockClass(q: number): string {
    if (q >= 20) return 'high';
    if (q >= 10) return 'medium';
    return 'low';
  }

  get totalValue(): number {
    return this.filtered.reduce((s, p) => s + (p.price * p.availableQuantity), 0);
  }
}
