import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id?: number;
  username?: string;
  password?: string; // Optional for updates
  phoneNumber?: string;
  email?: string;
  roleId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả người dùng
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Thêm mới người dùng
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Cập nhật thông tin người dùng
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Thêm method kiểm tra số điện thoại
  checkPhoneNumberExists(phoneNumber: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => users.some(user => user.phoneNumber === phoneNumber))
    );
  }
}
