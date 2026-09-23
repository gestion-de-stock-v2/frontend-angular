import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categorias: any[] = [];
  nova: any = { name: '', description: '' };
  editandoId: number | null = null;
  erro = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.api.getCategorias().subscribe({
      next: d => this.categorias = d,
      error: () => this.erro = 'Erreur de chargement'
    });
  }

  salvar(): void {
    this.erro = '';
    if (!this.nova.name?.trim()) return;
    if (this.editandoId) {
      this.api.updateCategoria(this.editandoId, this.nova).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    } else {
      this.api.createCategoria(this.nova).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    }
  }

  editar(c: any): void {
    this.editandoId = c.id;
    this.nova = { name: c.name, description: c.description };
  }

  excluir(id: number): void {
    if (confirm('Supprimer cette catégorie ?')) {
      this.api.deleteCategoria(id).subscribe(() => this.carregar());
    }
  }

  cancelar(): void {
    this.editandoId = null;
    this.nova = { name: '', description: '' };
    this.erro = '';
  }
}
