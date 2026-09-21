import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { IconComponent } from '../../components/icon/icon.component';

type StockFilter = 'all' | 'low' | 'medium' | 'high';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './stock.html',
  styleUrls: ['./stock.css']
})
export class Stock implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  filter: StockFilter = 'all';
  loading = true;
  erro = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.findAll().subscribe({
      next: (d: Product[]) => {
        this.products = d.sort((a, b) => a.availableQuantity - b.availableQuantity);
        this.applyFilter();
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => { this.erro = e?.error?.message || 'Erreur'; this.loading = false; }
    });
  }

  setFilter(f: StockFilter): void { this.filter = f; this.applyFilter(); }

  applyFilter(): void {
    switch (this.filter) {
      case 'low':    this.filtered = this.products.filter(p => p.availableQuantity < 10); break;
      case 'medium': this.filtered = this.products.filter(p => p.availableQuantity >= 10 && p.availableQuantity < 20); break;
      case 'high':   this.filtered = this.products.filter(p => p.availableQuantity >= 20); break;
      default:       this.filtered = this.products;
    }
  }

  get totalProducts(): number { return this.products.length; }
  get lowStockCount(): number { return this.products.filter(p => p.availableQuantity < 10).length; }
  get mediumStockCount(): number { return this.products.filter(p => p.availableQuantity >= 10 && p.availableQuantity < 20).length; }
  get highStockCount(): number { return this.products.filter(p => p.availableQuantity >= 20).length; }
  get totalUnits(): number { return this.products.reduce((s, p) => s + p.availableQuantity, 0); }
  get totalValue(): number { return this.products.reduce((s, p) => s + (p.price * p.availableQuantity), 0); }

  getStockClass(q: number): string { return q >= 20 ? 'high' : q >= 10 ? 'medium' : 'low'; }
  getStockLabel(q: number): string { return q >= 20 ? 'Élevé' : q >= 10 ? 'Moyen' : 'Faible'; }
  getStockPercent(q: number): number { return Math.min((q / 30) * 100, 100); }
}
