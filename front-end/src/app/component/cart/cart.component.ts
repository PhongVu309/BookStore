import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItem, CartService } from '../../services/cart/cart-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  quantity: number = 1;
  cartItems: CartItem[] = [];
  total: number = 0;
  payTotal: number = 0;
  totalDiscount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      this.payTotal = this.cartService.getPayableTotal();
      this.totalDiscount = this.cartService.getTotalDiscount();
    });
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.product.id, newQuantity);
      this.totalDiscount = this.cartService.getTotalDiscount();
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
    this.totalDiscount = this.cartService.getTotalDiscount();
  }
}
