import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetail, OrderDetailService } from '../../services/orderDetail/order-detail.service';
import { Order } from '../../services/order/order.service';

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail-modal.component.html',
  styleUrl: './order-detail-modal.component.css',
})
export class OrderDetailModalComponent implements OnInit {
  @Input() order?: Order;
  orderDetails: OrderDetail[] = [];

  constructor(private orderDetailService: OrderDetailService) {}

  ngOnInit() {
    if (this.order?.id) {
      this.orderDetailService.getOrderDetailsByOrderId(this.order.id).subscribe({
        next: (details) => {
          this.orderDetails = details;
        },
        error: (error) => {
          console.error('Error fetching order details:', error);
        }
      });
    }
  }
}
