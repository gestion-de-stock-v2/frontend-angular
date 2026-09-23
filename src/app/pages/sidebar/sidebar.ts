import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  private roleColors: Record<string, string> = {
    ADMIN:       '#144abf',
    GERANT:      '#2563eb',
    MAGASINIER:  '#0d2865',
    VENDEUR:     '#1143b1',
    ACHETEUR:    '#2a1fe6',
    COMPTABLE:   '#2563eb',
    OBSERVATEUR: '#2e54a6'
  };

  constructor(public auth: AuthService) {}

  getRoleColor(role: string): string {
    return this.roleColors[role] ?? '#4D6BFE';
  }
}
