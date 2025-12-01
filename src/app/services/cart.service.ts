import { Injectable, signal, computed } from '@angular/core';
import { CartItem, ShippingInfo } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Estado do carrinho
  private cartItems = signal<CartItem[]>([]);
  
  // Informações de frete
  private shippingInfo = signal<ShippingInfo | null>(null);

  // Computed signals
  items = computed(() => this.cartItems());
  
  itemCount = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  subtotal = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  shipping = computed(() => this.shippingInfo());

  // Frete padrão de R$15,00
  private readonly DEFAULT_SHIPPING = 15.00;

  shippingCost = computed(() => {
    // Frete grátis para compras acima de R$100
    if (this.subtotal() >= 100) return 0;
    
    const info = this.shippingInfo();
    // Se tem frete calculado pelo CEP, usa ele; senão, usa o padrão de R$15
    return info ? info.shippingCost : this.DEFAULT_SHIPPING;
  });

  total = computed(() => this.subtotal() + this.shippingCost());

  isFreeShipping = computed(() => this.subtotal() >= 100);

  constructor() {
    // Carregar carrinho do localStorage
    this.loadFromStorage();
  }

  // Adicionar produto ao carrinho
  addToCart(product: Product): void {
    const items = this.cartItems();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      // Incrementar quantidade se já existe
      this.updateQuantity(product.id!, existingItem.quantity + 1);
    } else {
      // Adicionar novo item com quantidade 1
      this.cartItems.set([...items, { product, quantity: 1 }]);
    }
    
    this.saveToStorage();
  }

  // Remover produto do carrinho
  removeFromCart(productId: number): void {
    const items = this.cartItems().filter(item => item.product.id !== productId);
    this.cartItems.set(items);
    this.saveToStorage();
  }

  // Atualizar quantidade
  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return; // Não permitir quantidade menor que 1
    
    const items = this.cartItems().map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItems.set(items);
    this.saveToStorage();
  }

  // Incrementar quantidade
  increment(productId: number): void {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  // Decrementar quantidade
  decrement(productId: number): void {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  // Verificar se produto está no carrinho
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  // Obter quantidade de um produto no carrinho
  getQuantity(productId: number): number {
    const item = this.cartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Calcular frete pelo CEP
  async calculateShipping(cep: string): Promise<ShippingInfo> {
    // Limpar CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. Digite 8 números.');
    }

    try {
      // Buscar endereço pelo ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }

      // Calcular frete baseado na região
      let shippingCost = this.calculateShippingCost(data.uf);
      
      // Frete grátis para compras acima de R$100
      const freeShipping = this.subtotal() >= 100;

      const info: ShippingInfo = {
        cep: cleanCep,
        address: `${data.logradouro}, ${data.bairro}`,
        city: data.localidade,
        state: data.uf,
        shippingCost,
        freeShipping
      };

      this.shippingInfo.set(info);
      this.saveToStorage();
      
      return info;
    } catch (error: any) {
      if (error.message) throw error;
      throw new Error('Erro ao consultar CEP. Tente novamente.');
    }
  }

  // Calcular custo do frete por estado
  private calculateShippingCost(state: string): number {
    const stateCosts: { [key: string]: number } = {
      // Sudeste
      'SP': 15.00, 'RJ': 18.00, 'MG': 20.00, 'ES': 22.00,
      // Sul
      'PR': 25.00, 'SC': 28.00, 'RS': 30.00,
      // Centro-Oeste
      'GO': 25.00, 'MS': 28.00, 'MT': 30.00, 'DF': 22.00,
      // Nordeste
      'BA': 35.00, 'SE': 35.00, 'AL': 38.00, 'PE': 38.00,
      'PB': 40.00, 'RN': 40.00, 'CE': 42.00, 'PI': 45.00, 'MA': 48.00,
      // Norte
      'PA': 50.00, 'AP': 55.00, 'AM': 55.00, 'RR': 60.00,
      'AC': 60.00, 'RO': 55.00, 'TO': 45.00
    };
    
    return stateCosts[state] || 35.00;
  }

  // Limpar informações de frete
  clearShipping(): void {
    this.shippingInfo.set(null);
    this.saveToStorage();
  }

  // Limpar carrinho
  clearCart(): void {
    this.cartItems.set([]);
    this.shippingInfo.set(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('shipping');
  }

  // Salvar no localStorage
  private saveToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    if (this.shippingInfo()) {
      localStorage.setItem('shipping', JSON.stringify(this.shippingInfo()));
    }
  }

  // Carregar do localStorage
  private loadFromStorage(): void {
    const cartData = localStorage.getItem('cart');
    const shippingData = localStorage.getItem('shipping');
    
    if (cartData) {
      this.cartItems.set(JSON.parse(cartData));
    }
    
    if (shippingData) {
      this.shippingInfo.set(JSON.parse(shippingData));
    }
  }
}
