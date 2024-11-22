import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRoles = route.data?.['roles'] as string[]; 

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
        return false;
      }

      const userRole = authService.getUserRole();
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        router.navigate(['/home']); 
        return false;
      }
      return true;
    })
  );
};