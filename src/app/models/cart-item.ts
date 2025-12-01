import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  cep: string;
  address?: string;
  city?: string;
  state?: string;
  shippingCost: number;
  freeShipping: boolean;
}
