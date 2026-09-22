import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Produto } from '../../models/produto.model';
import { Categoria } from '../../models/categoria.model';
import { Fornecedor } from '../../models/fornecedor.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  filtered: Produto[] = [];
  categorias: Categoria[] = [];
  fornecedores: Fornecedor[] = [];

  novo: Produto = { nome: '', descricao: '', preco: 0, quantidade: 0 };
  categoriaId: number | null = null;
  fornecedorId: number | null = null;
  editandoId: number | null = null;

  showForm = false;
  loading = false;
  erro = '';
  success = '';
  searchTerm = '';

  filter: 'all' | 'low' | 'medium' | 'high' = 'all';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregar();
    this.api.getCategorias().subscribe(d => this.categorias = d);
    this.api.getFornecedores().subscribe(d => this.fornecedores = d);
  }

  carregar(): void {
    this.api.getProdutos().subscribe({
      next: d => {
        this.produtos = d;
        this.applyFilter();
      },
      error: e => this.erro = e?.error?.message || 'Erreur de chargement'
    });
  }

  /* ============================================================
     FILTRES
     ============================================================ */
  setFilter(f: 'all' | 'low' | 'medium' | 'high'): void {
    this.filter = f;
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();

    let result = this.produtos;

    // Filtre stock
    if (this.filter === 'low') {
      result = result.filter(p => p.quantidade < 5);
    } else if (this.filter === 'medium') {
      result = result.filter(p => p.quantidade >= 5 && p.quantidade < 20);
    } else if (this.filter === 'high') {
      result = result.filter(p => p.quantidade >= 20);
    }

    // Filtre recherche
    if (term) {
      result = result.filter(p =>
        p.nome?.toLowerCase().includes(term) ||
        p.descricao?.toLowerCase().includes(term) ||
        p.categoria?.nome?.toLowerCase().includes(term) ||
        p.fornecedor?.nome?.toLowerCase().includes(term)
      );
    }

    this.filtered = result;
  }

  /* ============================================================
     STATISTIQUES
     ============================================================ */
  get totalProducts(): number {
    return this.produtos.length;
  }

  get lowStockCount(): number {
    return this.produtos.filter(p => p.quantidade < 5).length;
  }

  get mediumStockCount(): number {
    return this.produtos.filter(p => p.quantidade >= 5 && p.quantidade < 20).length;
  }

  get highStockCount(): number {
    return this.produtos.filter(p => p.quantidade >= 20).length;
  }

  get totalUnits(): number {
    return this.produtos.reduce((sum, p) => sum + (p.quantidade || 0), 0);
  }

  get totalValue(): number {
    return this.produtos.reduce(
      (sum, p) => sum + ((p.preco || 0) * (p.quantidade || 0)),
      0
    );
  }

  /* ============================================================
     UTILITAIRES STOCK
     ============================================================ */
  getStockClass(qty: number): string {
    if (qty < 5) return 'low';
    if (qty < 20) return 'medium';
    return 'high';
  }

  getStockPercent(qty: number): number {
    // Barre : 100% à partir de 30 unités
    const max = 30;
    return Math.min((qty / max) * 100, 100);
  }

  getStockLabel(qty: number): string {
    if (qty === 0) return 'Rupture';
    if (qty < 5) return 'Faible';
    if (qty < 20) return 'Moyen';
    return 'Élevé';
  }

  /* ============================================================
     CRUD
     ============================================================ */
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancelar();
  }

  salvar(): void {
    this.erro = '';
    this.success = '';

    if (!this.novo.nome?.trim()) {
      this.erro = 'Le nom est obligatoire';
      return;
    }

    const payload: Produto = {
      ...this.novo,
      preco: Number(this.novo.preco) || 0,
      quantidade: Number(this.novo.quantidade) || 0,
      categoria: this.categoriaId ? { id: this.categoriaId, nome: '' } : undefined,
      fornecedor: this.fornecedorId ? { id: this.fornecedorId, nome: '' } : undefined
    };

    this.loading = true;

    if (this.editandoId) {
      this.api.updateProduto(this.editandoId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Produit modifié';
          this.cancelar();
          this.carregar();
        },
        error: e => {
          this.loading = false;
          this.erro = e?.error?.message || 'Erreur modification';
        }
      });
    } else {
      this.api.createProduto(payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Produit créé';
          this.cancelar();
          this.carregar();
        },
        error: e => {
          this.loading = false;
          this.erro = e?.error?.message || 'Erreur création';
        }
      });
    }
  }

  editar(p: Produto): void {
    this.editandoId = p.id!;
    this.novo = { ...p };
    this.categoriaId = p.categoria?.id ?? null;
    this.fornecedorId = p.fornecedor?.id ?? null;
    this.showForm = true;
    this.erro = '';
    this.success = '';
  }

  excluir(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.api.deleteProduto(id).subscribe({
        next: () => this.carregar(),
        error: e => this.erro = e?.error?.message || 'Erreur suppression'
      });
    }
  }

  cancelar(): void {
    this.editandoId = null;
    this.novo = { nome: '', descricao: '', preco: 0, quantidade: 0 };
    this.categoriaId = null;
    this.fornecedorId = null;
    this.erro = '';
    this.success = '';
  }
}
