import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  providers: [],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  phone: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor( private router: Router) {}

  validatePhone() {
    if (!this.phone) {
      this.errorMessage = 'Vui lòng điền số điện thoại';
    } else {
      this.errorMessage = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.errorMessage = 'Vui lòng nhập mật khẩu';
    } else {
      this.errorMessage = '';
    }
  }
}
