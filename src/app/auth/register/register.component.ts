import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async onRegister() {
    // Validações
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Email inválido!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { user, session } = await this.supabase.signUp(this.email, this.password);
      
      if (session) {
        // Usuário auto-confirmado e logado
        alert('Conta criada com sucesso!');
        this.router.navigate(['/']);
      } else {
        // Necessita confirmação de email
        alert('Conta criada! Verifique seu email para confirmar o cadastro.');
        this.router.navigate(['/login']);
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Erro ao criar conta!';
      console.error('Erro no registro:', err);
    } finally {
      this.loading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearError() {
    this.errorMessage = '';
  }
}
