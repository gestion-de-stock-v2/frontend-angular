import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css']
})
export class FornecedoresComponent implements OnInit {
  fornecedores: any[] = [];
  novo: any = { name: '', registrationNumber: '', phone: '', email: '' };
  editandoId: number | null = null;
  erro = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.api.getFornecedores().subscribe(d => this.fornecedores = d);
  }

  salvar(): void {
    this.erro = '';
    if (!this.novo.name?.trim()) return;
    if (this.editandoId) {
      this.api.updateFornecedor(this.editandoId, this.novo).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    } else {
      this.api.createFornecedor(this.novo).subscribe({
        next: () => { this.cancelar(); this.carregar(); },
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    }
  }

  editar(f: any): void {
    this.editandoId = f.id;
    this.novo = { name: f.name, registrationNumber: f.registrationNumber, phone: f.phone, email: f.email };
  }

  excluir(id: number): void {
    if (confirm('Supprimer ce fournisseur ?')) {
      this.api.deleteFornecedor(id).subscribe(() => this.carregar());
    }
  }

  cancelar(): void {
    this.editandoId = null;
    this.novo = { name: '', registrationNumber: '', phone: '', email: '' };
  }
}
