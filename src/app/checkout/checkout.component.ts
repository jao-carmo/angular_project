import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cartService = inject(CartService);
  router = inject(Router);
  
  orderConfirmed: boolean = false;
  orderNumber: string = '';

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

  get itemCount() {
    return this.cartService.itemCount();
  }

  confirmOrder(): void {
    // Gerar número do pedido
    this.orderNumber = 'PED-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Marcar como confirmado
    this.orderConfirmed = true;
    
    // Limpar carrinho após 3 segundos
    setTimeout(() => {
      this.cartService.clearCart();
    }, 3000);
  }

  cancelOrder(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/60?text=Sem+Imagem';
  }
}
