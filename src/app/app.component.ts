import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { HeaderComponent } from './layout/header/header.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { AuthService } from './auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideNavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'AMS';
  isLoggedIn = false;

  constructor(
    private firestore: Firestore, 
    private authService: AuthService
  ) {
    // Use takeUntilDestroyed to automatically unsubscribe
    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed())
      .subscribe(status => {
        this.isLoggedIn = status;
      });
  }

  ngOnInit() {
    // Additional initialization if needed
  }
}