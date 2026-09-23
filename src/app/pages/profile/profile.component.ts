import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  showPassword = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  messageType: 'success' | 'error' = 'success';
  loading = false;

  roleDescriptions: Record<string, string> = {
    ADMIN: 'Accès complet',
    GERANT: 'Gestion complète sauf utilisateurs',
    MAGASINIER: 'Mouvements de stock',
    VENDEUR: 'Ventes et consultation',
    ACHETEUR: 'Achats et fournisseurs',
    COMPTABLE: 'Lecture seule',
    OBSERVATEUR: 'Lecture seule'
  };
  roleColors: Record<string, string> = {
    ADMIN: '#dc2626', GERANT: '#2563eb', MAGASINIER: '#d97706',
    VENDEUR: '#16a34a', ACHETEUR: '#4f46e5', COMPTABLE: '#9333ea', OBSERVATEUR: '#64748b'
  };
  roleIcons: Record<string, string> = {
    ADMIN: 'crown', GERANT: 'briefcase', MAGASINIER: 'package',
    VENDEUR: 'cart', ACHETEUR: 'shoppingBag', COMPTABLE: 'chart', OBSERVATEUR: 'eye'
  };

  constructor(public auth: AuthService) {}

  get user() { return this.auth.currentUser(); }
  getRoleDescription(role: string): string { return this.roleDescriptions[role] ?? ''; }
  getRoleColor(role: string): string { return this.roleColors[role] ?? '#64748b'; }
  getRoleIcon(role: string): string { return this.roleIcons[role] ?? 'user'; }

  changerMotDePasse(): void {
    this.message = '';
    if (this.newPassword.length < 6) {
      this.message = 'Le mot de passe doit contenir au moins 6 caractères';
      this.messageType = 'error';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      this.messageType = 'error';
      return;
    }
    this.loading = true;
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res?.message || 'Mot de passe modifié';
        this.messageType = 'success';
        this.currentPassword = this.newPassword = this.confirmPassword = '';
      },
      error: (e) => {
        this.loading = false;
        this.message = e?.error?.message || 'Erreur';
        this.messageType = 'error';
      }
    });
  }
}
