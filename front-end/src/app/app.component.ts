import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHeaderComponent } from "./component/layout-header/layout-header.component";
import { LayoutFooterComponent } from "./component/layout-footer/layout-footer.component";
import { AdminComponent } from "./component/admin/admin.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutHeaderComponent, LayoutFooterComponent, AdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BookStore';
}
