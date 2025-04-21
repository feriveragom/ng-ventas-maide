import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos isAuthenticated$ para verificar si el usuario está logueado
  return authService.isAuthenticated$.pipe(
    take(1), // Tomamos solo el primer valor emitido para evitar suscripciones persistentes
    map(isAuthenticated => {
      if (isAuthenticated) {
        console.log('AuthGuard: Acceso permitido');
        return true; // Usuario autenticado, permitir acceso
      } else {
        console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
        // Usuario no autenticado, redirigir a la página de login
        // Pasamos state.url a NavigationExtras para que pueda redirigir de vuelta después del login (opcional)
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false; // No permitir acceso a la ruta actual
      }
    })
    // Alternativa usando tap (menos común para guards pero posible):
    // tap(isAuthenticated => {
    //   if (!isAuthenticated) {
    //     console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
    //     router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //   }
    // }),
    // map(isAuthenticated => !!isAuthenticated) // Asegurar que el guard devuelve boolean
  );
}; 