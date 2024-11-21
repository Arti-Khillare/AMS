import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { ReportComponent } from './components/report/report.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'add-events',
    component: AddEventComponent
  },
  {
    path: 'reports',
    component: ReportComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PagenotfoundComponent // Wildcard route for a 404 page
  }
];
