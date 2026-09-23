import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    ThemeToggleComponent
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  private roleColors: Record<string, string> = {
    ADMIN:       '#dc2626',
    GERANT:      '#2563eb',
    MAGASINIER:  '#d97706',
    VENDEUR:     '#16a34a',
    ACHETEUR:    '#4f46e5',
    COMPTABLE:   '#9333ea',
    OBSERVATEUR: '#64748b'
  };

  constructor(public auth: AuthService) {}

  getRoleColor(role: string): string {
    return this.roleColors[role] ?? '#4D6BFE';
  }
}
