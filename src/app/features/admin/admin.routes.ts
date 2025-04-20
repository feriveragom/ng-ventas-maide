import { Routes } from '@angular/router';

// Importa los componentes de página que acabamos de crear
import { AdminProductListComponent } from './pages/products/admin-product-list/admin-product-list.component';
import { CreateProductPageComponent } from './pages/products/create-product-page/create-product-page.component';
import { EditProductPageComponent } from './pages/products/edit-product-page/edit-product-page.component';

// Importa componentes de Categorías
import { AdminCategoryListComponent } from './pages/categories/admin-category-list/admin-category-list.component';
import { CreateCategoryPageComponent } from './pages/categories/create-category-page/create-category-page.component';
import { EditCategoryPageComponent } from './pages/categories/edit-category-page/edit-category-page.component';

// Define las rutas específicas para la sección de administración
export const ADMIN_ROUTES: Routes = [
  {
    path: 'products',
    component: AdminProductListComponent
  },
  {
    path: 'products/new',
    component: CreateProductPageComponent
  },
  {
    path: 'products/edit/:id', // Ruta para editar un producto específico por su ID
    component: EditProductPageComponent
  },
  {
    path: 'categories',
    component: AdminCategoryListComponent
  },
  {
    path: 'categories/new',
    component: CreateCategoryPageComponent
  },
  {
    path: 'categories/edit/:id',
    component: EditCategoryPageComponent
  },
  {
    path: '', // Ruta raíz dentro de /admin, redirige a la lista de productos
    redirectTo: 'products',
    pathMatch: 'full'
  },
  // Aquí podríamos añadir otras secciones de admin (usuarios, pedidos, etc.)
]; 