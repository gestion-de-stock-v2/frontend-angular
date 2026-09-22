import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';
import { Role } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  showPassword = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  messageType: 'success' | 'error' = 'success';
  loading = false;

  roleDescriptions: Record<Role, string> = {
    ADMIN:       'Accès complet : produits, catégories, fournisseurs, mouvements et gestion des utilisateurs.',
    GERANT:      'Gestion complète de l\'inventaire sauf la gestion des utilisateurs.',
    MAGASINIER:  'Enregistrement des mouvements de stock (entrées et sorties) et consultation.',
    VENDEUR:     'Consultation de l\'inventaire et enregistrement des sorties de stock (ventes).',
    ACHETEUR:    'Consultation, entrées de stock et gestion des fournisseurs.',
    COMPTABLE:   'Consultation en lecture seule pour analyse et reporting.',
    OBSERVATEUR: 'Accès en lecture seule à toutes les données.'
  };

  roleColors: Record<Role, string> = {
    ADMIN:       '#0C2ED2',
    GERANT:      '#1B3BD8',
    MAGASINIER:  '#2A47DE',
    VENDEUR:     '#3B5BDB',
    ACHETEUR:    '#4D6BFE',
    COMPTABLE:   '#5E7AFE',
    OBSERVATEUR: '#6B7280'
  };

  roleIcons: Record<Role, string> = {
    ADMIN:       'crown',
    GERANT:      'briefcase',
    MAGASINIER:  'package',
    VENDEUR:     'cart',
    ACHETEUR:    'shoppingBag',
    COMPTABLE:   'chart',
    OBSERVATEUR: 'eye'
  };

  constructor(public auth: AuthService) {}

  get user() { return this.auth.currentUser(); }
  getRoleDescription(role: Role): string { return this.roleDescriptions[role]; }
  getRoleColor(role: Role): string { return this.roleColors[role]; }
  getRoleIcon(role: Role): string { return this.roleIcons[role]; }

  changerMotDePasse(): void {
    this.message = '';
    if (this.newPassword.length < 6) {
      this.message = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      this.messageType = 'error';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      this.messageType = 'error';
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.message = 'Le nouveau mot de passe doit être différent de l\'ancien';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res?.message || 'Mot de passe modifié avec succès';
        this.messageType = 'success';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (e) => {
        this.loading = false;
        this.message = e?.error?.message || 'Erreur lors du changement';
        this.messageType = 'error';
      }
    });
  }
}
