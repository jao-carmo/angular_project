import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(private supabase: SupabaseService, public router: Router) {}

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (this.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    this.loading = true;
    try {
      await this.supabase.register(this.email, this.password);
      alert('Cadastro realizado! Verifique seu email para confirmar.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert(err.message || 'Erro ao fazer cadastro!');
    } finally {
      this.loading = false;
    }
  }
}
