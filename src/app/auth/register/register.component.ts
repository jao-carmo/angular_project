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
      const result = await this.supabase.signUp(this.email, this.password);

      if (result.session) {
        // Usuário auto-confirmado e logado
        alert('✅ Conta criada com sucesso! Você já está logado.');
        this.router.navigate(['/']);
      } else if (result.user) {
        // Necessita confirmação de email
        alert('✅ Conta criada! Verifique seu email para confirmar o cadastro.');
        this.router.navigate(['/login']);
      }
    } catch (err: any) {
      // Tratamento de erros específicos
      console.error('Erro completo no registro:', err);
      
      if (err.message?.includes('invalid')) {
        this.errorMessage = 'Email inválido! Use um endereço de email real (ex: usuario@gmail.com)';
      } else if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
        this.errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (err.message?.includes('não foi possível')) {
        this.errorMessage = err.message; // Mensagem já formatada do service
      } else {
        this.errorMessage = err.message || 'Erro ao criar conta!';
      }
    } finally {
      this.loading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    // Validação mais rigorosa de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }

    // Lista de domínios válidos comuns (opcional, mas ajuda o usuário)
    const domain = email.split('@')[1]?.toLowerCase();
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
                          'live.com', 'icloud.com', 'protonmail.com', 'teste.com'];
    
    // Se não estiver na lista comum, apenas avisa mas permite
    // (o Supabase fará a validação final)
    return true;
  }

  clearError() {
    this.errorMessage = '';
  }
}
