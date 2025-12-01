import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router);
  
  cep: string = '';
  loadingCep: boolean = false;
  cepError: string = '';

  get items() {
    return this.cartService.items();
  }

  get subtotal() {
    return this.cartService.subtotal();
  }

  get shipping() {
    return this.cartService.shipping();
  }

  get shippingCost() {
    return this.cartService.shippingCost();
  }

  get total() {
    return this.cartService.total();
  }

  get isFreeShipping() {
    return this.cartService.isFreeShipping();
  }

  increment(productId: number): void {
    this.cartService.increment(productId);
  }

  decrement(productId: number): void {
    this.cartService.decrement(productId);
  }

  removeItem(productId: number): void {
    if (confirm('Deseja remover este item do carrinho?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  async calculateShipping(): Promise<void> {
    if (!this.cep) {
      this.cepError = 'Digite o CEP';
      return;
    }

    this.loadingCep = true;
    this.cepError = '';

    try {
      await this.cartService.calculateShipping(this.cep);
    } catch (error: any) {
      this.cepError = error.message;
    } finally {
      this.loadingCep = false;
    }
  }

  formatCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    this.cep = value;
  }

  goToCheckout(): void {
    if (this.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!this.shipping) {
      alert('Por favor, calcule o frete primeiro!');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/80?text=Sem+Imagem';
  }
}
