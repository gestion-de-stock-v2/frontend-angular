import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  constructor(public theme: ThemeService, public auth: AuthService) {}
}
