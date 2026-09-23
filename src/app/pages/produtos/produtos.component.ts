import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtos: any[] = [];
  categorias: any[] = [];
  fornecedores: any[] = [];
  novo: any = { name: '', description: '', price: 0, availableQuantity: 0 };
  categoriaId: number | null = null;
  fornecedorId: number | null = null;
  editandoId: number | null = null;
  erro = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregar();
    this.api.getCategorias().subscribe(d => this.categorias = d);
    this.api.getFornecedores().subscribe(d => this.fornecedores = d);
  }

  carregar(): void {
    this.api.getProdutos().subscribe(d => this.produtos = d);
  }

  salvar(): void {
    this.erro = '';
    if (!this.novo.name?.trim()) {
      this.erro = 'Nom obligatoire';
      return;
    }
    const payload = {
      name: this.novo.name,
      description: this.novo.description,
      price: Number(this.novo.price) || 0,
      availableQuantity: Number(this.novo.availableQuantity) || 0,
      categoryId: this.categoriaId,
      supplierId: this.fornecedorId
    };
    if (this.editandoId) {
      this.api.updateProduto(this.editandoId, payload).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    } else {
      this.api.createProduto(payload).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    }
  }

  editar(p: any): void {
    this.editandoId = p.id;
    this.novo = { name: p.name, description: p.description, price: p.price, availableQuantity: p.availableQuantity };
    this.categoriaId = p.categoryId ?? null;
    this.fornecedorId = p.supplierId ?? null;
  }

  excluir(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.api.deleteProduto(id).subscribe(() => this.carregar());
    }
  }

  cancelar(): void {
    this.editandoId = null;
    this.novo = { name: '', description: '', price: 0, availableQuantity: 0 };
    this.categoriaId = null;
    this.fornecedorId = null;
  }
}
