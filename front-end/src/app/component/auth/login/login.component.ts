import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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

  login() {
    if (!this.phone || !this.password) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }

    this.authService.login(this.phone, this.password).subscribe({
      next: (user) => {
        alert('Đăng nhập thành công!');
        if (user.roleId === 1) {
          window.location.reload();
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Số điện thoại hoặc mật khẩu không đúng';
      }
    });
  }
}
