import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItem, cartService } from '../../services/cart/cart-service.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private http = inject(HttpClient); // Inject HttpClient thay vì constructor
  private fb = inject(FormBuilder);

  locationForm: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: cartService
  ) {
    this.locationForm = this.fb.group({
      province: [''],
      district: [''],
      ward: ['']
    });
  }

  ngOnInit() {
    this.loadProvinces();

    // Lấy thông tin giỏ hàng
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
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
}
