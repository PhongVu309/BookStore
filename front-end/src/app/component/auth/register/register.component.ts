import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { finalize,map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

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

    this.isLoading = true;

    this.userService.checkPhoneNumberExists(this.phone)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (exists) => {
          if (exists) {
            this.errorMessage = 'Số điện thoại này đã được đăng ký';
            return;
          }
          const newUser = {
            username: this.name,
            password: this.password,
            phoneNumber: this.phone,
            email: this.email,
            roleId: 2
          };

          this.userService.createUser(newUser).subscribe({
            next: () => {
              alert('Đăng ký thành công!');
              this.router.navigate(['/login']);
            },
            error: (error) => {
              this.errorMessage = 'Đã có lỗi xảy ra khi đăng ký';
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Đã có lỗi xảy ra khi kiểm tra số điện thoại';
        }
      });
  }
}
