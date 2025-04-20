import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Usa el layout principal para estas rutas
    children: [
      {
        path: 'productos', // La sección de productos se cargará bajo /productos
        loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
      },
      {
        path: 'admin',
        component: AdminLayoutComponent, // Usar AdminLayoutComponent como contenedor
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
        // Las rutas de ADMIN_ROUTES (products, categories) ahora serán hijas de AdminLayout
      },
      // Aquí podrías añadir otras secciones principales lazy-loaded (ej: admin, auth)
      // {
      //   path: 'admin',
      //   loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      // },
      {
        path: '', // Redirige la ruta raíz del layout a /productos
        redirectTo: 'productos',
        pathMatch: 'full'
      }
    ]
  },
  // Aquí podrías añadir rutas que NO usen MainLayoutComponent, como una página de login/registro independiente
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  // },

  // Ruta comodín para páginas no encontradas (opcional, pero recomendado)
  // {
  //   path: '**',
  //   loadComponent: () => import('./core/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  // }
];
