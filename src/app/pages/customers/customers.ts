import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  novo: Customer = { firstname: '', lastname: '', email: '', address: '' };
  editandoId: number | null = null;
  showForm = false;
  loading = false;
  erro = '';

  constructor(private service: CustomerService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.service.findAll().subscribe({
      next: (d: Customer[]) => this.customers = d,
      error: (e: HttpErrorResponse) => this.erro = e?.error?.message || 'Erreur'
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.reset();
  }

  reset(): void {
    this.novo = { firstname: '', lastname: '', email: '', address: '' };
    this.editandoId = null;
    this.erro = '';
  }

  salvar(): void {
    this.erro = '';
    if (!this.novo.firstname || !this.novo.lastname || !this.novo.email) {
      this.erro = 'Prénom, nom et email sont obligatoires';
      return;
    }
    this.loading = true;
    const op = this.editandoId
      ? this.service.update(this.editandoId, this.novo)
      : this.service.create(this.novo);
    op.subscribe({
      next: () => { this.loading = false; this.reset(); this.showForm = false; this.carregar(); },
      error: (e: HttpErrorResponse) => { this.loading = false; this.erro = e?.error?.message || 'Erreur'; }
    });
  }

  editar(c: Customer): void {
    this.editandoId = c.id!;
    this.novo = { ...c };
    this.showForm = true;
  }

  excluir(id: number): void {
    if (confirm('Supprimer ce client ?')) {
      this.service.delete(id).subscribe(() => this.carregar());
    }
  }
}
