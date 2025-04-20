import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';

// Define las rutas específicas para la sección de productos
export const PRODUCT_ROUTES: Routes = [
  {
    path: '', // Ruta raíz dentro de la sección de productos (ej: /productos)
    component: ProductListComponent,
    // Aquí podrías añadir más rutas hijas si las necesitas (ej: /productos/:id)
    // {
    //   path: ':id',
    //   loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    // }
  },
  // Puedes añadir otras rutas a nivel de feature aquí, por ejemplo, para categorías:
  // {
  //  path: 'categorias',
  //  component: CategoriesComponent
  // }
]; 