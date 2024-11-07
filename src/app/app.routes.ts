import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './layout/pagenotfound/pagenotfound.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'add-events',
    component: AddEventComponent
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
