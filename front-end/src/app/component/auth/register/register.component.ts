import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor( private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }

    if (!/^\d+$/.test(this.phone)) {
      this.errorMessage = 'Số điện thoại phải là dạng số';
      return;
    }

    if (!this.email.includes('@gmail.com')) {
      this.errorMessage = 'Email không hợp lệ';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp';
      return;
    }
    this.router.navigate(['/login']);
  }
}
