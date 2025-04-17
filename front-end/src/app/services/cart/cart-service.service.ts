import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../products/product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class cartService {
  private cartKey = 'shopping_cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}
