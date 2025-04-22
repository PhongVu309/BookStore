import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { User, UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';  // Add this import
import { OrderService, Order } from '../../services/order/order.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  currentUser: User = {};
  errorMessage: string = '';
  successMessage: string = '';
  orders: Order[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roleId: user.roleId
      };
    }

    // Load orders for logged in user
    if (this.currentUser.id) {
      this.orderService.getOrdersByUserId(this.currentUser.id).subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    }
  }

  updateProfile() {
    if (!this.currentUser.id) {
      this.errorMessage = 'Không tìm thấy thông tin người dùng';
      return;
    }

    if (!this.currentUser.username || !this.currentUser.email || !this.currentUser.phoneNumber) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }

    if (!this.currentUser.email.includes('@')) {
      this.errorMessage = 'Email không hợp lệ';
      return;
    }

    if (!/^\d+$/.test(this.currentUser.phoneNumber || '')) {
      this.errorMessage = 'Số điện thoại không hợp lệ';
      return;
    }

    if (this.currentUser.password) {
      if (this.currentUser.password.length < 6) {
        this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
        return;
      }
    }

    const updateData: User = {
      ...this.currentUser,
      password: this.currentUser.password || undefined
    };

    this.userService.updateUser(this.currentUser.id!, updateData).subscribe({
      next: (updatedUser) => {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUserData = {
            ...currentUser,
            ...updatedUser,
            password: undefined
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        }

        this.currentUser.password = '';
        this.successMessage = 'Cập nhật thông tin thành công';
        this.errorMessage = '';

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin';
        this.successMessage = '';
      }
    });
  }
}
