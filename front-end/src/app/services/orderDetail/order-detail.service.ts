import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../products/product.service';

export interface OrderDetail {
  id?: number;
  quantity: number;
  price: number;
  productId: number;
  orderId: number; // Đã loại bỏ khả năng undefined
}

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private apiUrl = 'http://localhost:8080/order-details';

  constructor(private http: HttpClient) { }

  createOrderDetails(orderDetails: OrderDetail[]): Observable<OrderDetail[]> {
    return this.http.post<OrderDetail[]>(`${this.apiUrl}/batch`, orderDetails);
  }
}
