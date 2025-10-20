import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: 'inventory_2',
      title: 'Gerenciar Produtos',
      description: 'Adicione, edite e exclua produtos do seu catálogo',
      route: '/products'
    }
  ];

  constructor(
    public supabase: SupabaseService,
    private router: Router
  ) {}

  async onLogout() {
    try {
      await this.supabase.logout();
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert(err.message || 'Erro ao fazer logout!');
    }
  }
}
