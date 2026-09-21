import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtos: Product[] = [];
  filtered: Product[] = [];
  searchTerm = '';

  novo: Product = {
    name: '',
    description: '',
    price: 0,
    availableQuantity: 0
  };

  editandoId: number | null = null;
  showForm = false;
  loading = false;
  erro = '';
  success = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.productService.findAll().subscribe({
      next: (d: Product[]) => {
        this.produtos = d;
        this.applyFilter();
      },
      error: (e: HttpErrorResponse) => {
        this.erro = e?.error?.message || 'Erreur de chargement';
      }
    });
  }

  applyFilter(): void {
    const t = this.searchTerm.toLowerCase().trim();
    if (!t) {
      this.filtered = this.produtos;
      return;
    }
    this.filtered = this.produtos.filter((p: Product) =>
      p.name?.toLowerCase().includes(t) ||
      p.description?.toLowerCase().includes(t)
    );
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.reset();
  }

  reset(): void {
    this.novo = { name: '', description: '', price: 0, availableQuantity: 0 };
    this.editandoId = null;
    this.erro = '';
    this.success = '';
  }

  salvar(): void {
    this.erro = '';
    this.success = '';

    if (!this.novo.name?.trim()) {
      this.erro = 'Le nom est obligatoire';
      return;
    }
    if (this.novo.price < 0) {
      this.erro = 'Le prix ne peut pas etre negatif';
      return;
    }
    if (this.novo.availableQuantity < 0) {
      this.erro = 'La quantite ne peut pas etre negative';
      return;
    }

    const payload: Product = {
      name: this.novo.name.trim(),
      description: this.novo.description?.trim() || '',
      price: Number(this.novo.price) || 0,
      availableQuantity: Number(this.novo.availableQuantity) || 0
    };

    this.loading = true;

    if (this.editandoId) {
      this.productService.update(this.editandoId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Produit mis a jour';
          this.showForm = false;
          this.reset();
          this.carregar();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.erro = e?.error?.message || 'Erreur lors de la mise a jour';
        }
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Produit cree';
          this.showForm = false;
          this.reset();
          this.carregar();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.erro = e?.error?.message || 'Erreur lors de la creation';
        }
      });
    }
  }

  editar(p: Product): void {
    this.editandoId = p.id!;
    this.novo = { ...p };
    this.showForm = true;
  }

  excluir(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.success = 'Produit supprime';
          this.carregar();
        },
        error: (e: HttpErrorResponse) => {
          this.erro = e?.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }

  getStockClass(q: number): string {
    if (q >= 20) return 'high';
    if (q >= 10) return 'medium';
    return 'low';
  }
}
