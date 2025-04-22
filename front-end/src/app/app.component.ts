import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutHeaderComponent } from './component/layout-header/layout-header.component';
import { LayoutFooterComponent } from './component/layout-footer/layout-footer.component';
import { AdminComponent } from './component/admin/admin.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutHeaderComponent,
    LayoutFooterComponent,
    AdminComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.roleId === 1;
    });
  }
}
