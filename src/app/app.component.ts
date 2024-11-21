import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { AuthService } from './auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule , HeaderComponent, SideNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'AMS';
  isLoggedIn = false;
  userRole: string = '';

  constructor(
    private authService: AuthService
  ) {
    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed())
      .subscribe(status => {
        this.isLoggedIn = status;
        this.userRole = this.authService.getUserRole();
        console.log(this.userRole, "userRole")
      });
  }

  ngOnInit() {

  }
}