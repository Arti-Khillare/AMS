import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }

  openAddEvent(): void {
    this.router.navigate(['add-events']);
  }
}
