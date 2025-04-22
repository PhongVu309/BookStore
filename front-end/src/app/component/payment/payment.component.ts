import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartItem, CartService } from '../../services/cart/cart-service.service';
import { OrderService } from '../../services/order/order.service';
import { OrderDetailService } from '../../services/orderDetail/order-detail.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  locationForm: FormGroup;
  paymentForm: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  cartItems: CartItem[] = [];
  payTotal: number = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      houseNumber: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      fullname: [''],
      email: [''],
      phone: [''],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadProvinces();

    this.paymentForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      note: ['']
    });

    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.payTotal = this.cartService.getPayableTotal();
    });
  }

  loadProvinces() {
    this.http.get<any[]>('https://provinces.open-api.vn/api/p/').subscribe(data => {
      this.provinces = data;
    });
  }

  onProvinceChange() {
    const provinceCode = this.locationForm.value.province;
    this.http.get<any>(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).subscribe(data => {
      this.districts = data.districts;
      this.locationForm.patchValue({ district: '', ward: '' });
      this.wards = [];
    });
  }

  onDistrictChange() {
    const districtCode = this.locationForm.value.district;
    this.http.get<any>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).subscribe(data => {
      this.wards = data.wards;
      this.locationForm.patchValue({ ward: '' });
    });
  }

  private getFullAddress(): string {
    const provinceCode = this.locationForm.get('province')?.value;
    const districtCode = this.locationForm.get('district')?.value;
    const wardCode = this.locationForm.get('ward')?.value;
    const houseNumber = this.locationForm.get('houseNumber')?.value;

    const province = this.provinces.find(p => p.code === Number(provinceCode));
    const district = this.districts.find(d => d.code === Number(districtCode));
    const ward = this.wards.find(w => w.code === Number(wardCode));

    if (!province || !district || !ward || !houseNumber) {
      throw new Error('Địa chỉ không hợp lệ');
    }

    return `${houseNumber}, ${ward.name}, ${district.name}, ${province.name}`;
  }

  onCheckout() {
    if (this.paymentForm.invalid || this.locationForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin bao gồm địa chỉ!');
      return;
    }

    try {
      const order = {
        name: this.paymentForm.get('fullname')?.value,
        email: this.paymentForm.get('email')?.value,
        phoneNumber: this.paymentForm.get('phone')?.value,
        address: this.getFullAddress(),
        totalPrice: this.payTotal,
        note: this.paymentForm.get('note')?.value,
        orderStatus: 'Đang xử lý',
        createdAt: new Date().toISOString()
      };

      this.orderService.createOrder(order).subscribe({
        next: (createdOrder) => {
          if (!createdOrder || !createdOrder.id) {
            throw new Error('Order creation failed');
          }

          const orderDetails = this.cartItems.map(item => ({
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.id,
            orderId: createdOrder.id! // Sử dụng ID của đơn hàng đã tạo
          }));

          this.orderDetailService.createOrderDetails(orderDetails).subscribe({
            next: () => {
              this.cartService.clearCart();
              this.router.navigate(['/']);
              alert('Đặt hàng thành công!');
            },
            error: (error) => {
              console.error('Error creating order details:', error);
              alert('Có lỗi xảy ra khi tạo chi tiết đơn hàng!');
            }
          });
        },
        error: (error) => {
          console.error('Error creating order:', error);
          alert('Có lỗi xảy ra khi tạo đơn hàng!');
        }
      });
    } catch (error) {
      alert('Vui lòng kiểm tra lại thông tin địa chỉ');
      return;
    }
  }
}
