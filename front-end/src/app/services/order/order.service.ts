import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  totalPrice: number;
  note: string;
  orderStatus: string;
  createdAt: string;
  userId?: number | null; // Thêm trường userId
}

export interface OrderStatistics {
    totalOrders: number;
    totalRevenue: number;
    successOrders: number;
    pendingOrders: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getStatistics(type: string, startDate: string, endDate: string) {
    return this.http.get<any[]>(`${this.apiUrl}/statistics`, {
        params: { type, startDate, endDate }
    });
  }

  getStatisticsSummary(startDate: string, endDate: string): Observable<OrderStatistics> {
    return this.http.get<OrderStatistics>(`${this.apiUrl}/statistics/summary`, {
        params: { startDate, endDate }
    });
  }
}
