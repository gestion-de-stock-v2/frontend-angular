import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../components/icon/icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: string[] = ['ADMIN', 'GERANT', 'MAGASINIER', 'VENDEUR', 'ACHETEUR', 'COMPTABLE', 'OBSERVATEUR'];

  roleIcons: Record<string, string> = {
    ADMIN: 'crown', GERANT: 'briefcase', MAGASINIER: 'package',
    VENDEUR: 'cart', ACHETEUR: 'shoppingBag', COMPTABLE: 'chart', OBSERVATEUR: 'eye'
  };
  roleColors: Record<string, string> = {
    ADMIN: '#2563eb', GERANT: '#2563eb', MAGASINIER: '#2563eb',
    VENDEUR: '#2563eb', ACHETEUR: '#4f46e5', COMPTABLE: '#2563eb', OBSERVATEUR: '#2563eb'
  };

  showForm = false;
  loading = false;
  erro = '';
  success = '';
  showPassword = false;

  novo: any = {
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'OBSERVATEUR'
  };

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.erro = '';
    this.http.get<any>('/api/v1/users').subscribe({
      next: d => this.usuarios = Array.isArray(d) ? d : (d.content ?? []),
      error: e => this.erro = e?.error?.message || 'Erreur de chargement'
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm(): void {
    this.novo = { username: '', password: '', name: '', email: '', role: 'OBSERVATEUR' };
    this.erro = '';
    this.success = '';
    this.showPassword = false;
  }

  creer(): void {
    this.erro = '';
    this.success = '';

    if (!this.novo.username?.trim() || this.novo.username.length < 3) {
      this.erro = 'Nom d\'utilisateur requis (3 caractères minimum)';
      return;
    }
    if (!this.novo.password || this.novo.password.length < 6) {
      this.erro = 'Mot de passe requis (6 caractères minimum)';
      return;
    }
    if (!this.novo.name?.trim()) {
      this.erro = 'Nom complet requis';
      return;
    }
    if (!this.novo.email?.trim()) {
      this.erro = 'Email requis';
      return;
    }

    this.loading = true;
    this.http.post<any>('/api/v1/auth/register', this.novo).subscribe({
      next: () => {
        this.loading = false;
        this.success = `Utilisateur « ${this.novo.username} » créé avec succès`;
        this.resetForm();
        this.showForm = false;
        this.carregar();
      },
      error: (e) => {
        this.loading = false;
        this.erro = e?.error?.message || 'Erreur lors de la création';
      }
    });
  }

  excluir(u: any): void {
    if (!u.id) return;
    if (u.username === this.auth.currentUser()?.username) {
      this.erro = 'Vous ne pouvez pas supprimer votre propre compte';
      return;
    }
    if (confirm(`Supprimer l'utilisateur « ${u.username} » ?`)) {
      this.http.delete(`/api/v1/users/${u.id}`).subscribe({
        next: () => this.carregar(),
        error: (e) => this.erro = e?.error?.message || 'Erreur'
      });
    }
  }

  getRoleIcon(role: string): string { return this.roleIcons[role] ?? 'user'; }
  getRoleColor(role: string): string { return this.roleColors[role] ?? '#64748b'; }
  countByRole(role: string): number { return this.usuarios.filter(u => u.role === role).length; }
}
