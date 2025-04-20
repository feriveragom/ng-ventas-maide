import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para async pipe, ngIf, ngFor
import { Router, RouterLink } from '@angular/router'; // Para navegación y routerLink
import { Observable, combineLatest, map, catchError, of, startWith } from 'rxjs';

// Modelos y Servicios
import { Product } from '../../../../products/models/product.model';
import { Category } from '../../../../products/models/category.model';
import { ProductService } from '../../../../products/services/product.service';
import { CategoryService } from '../../../../../core/services/category.service';

// Interfaz para los datos combinados
interface ProductWithCategory extends Product {
  categoryName?: string; // Nombre de la categoría opcional
}

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importar RouterLink para los botones
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'] // Corregido a styleUrls
})
export class AdminProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // Observable combinado para productos con nombres de categoría
  productsWithCategories$!: Observable<{ loading: boolean; data: ProductWithCategory[]; error: string | null }>;

  ngOnInit(): void {
    this.loadProductsWithCategories();
  }

  loadProductsWithCategories(): void {
    // Creamos observables para productos y categorías
    const products$ = this.productService.getProducts();
    const categories$ = this.categoryService.getCategories();

    // Combinamos ambos observables
    this.productsWithCategories$ = combineLatest([products$, categories$]).pipe(
      map(([products, categories]) => {
        // Creamos un mapa de categorías por ID para búsqueda rápida
        const categoryMap = new Map<string, string>();
        categories.forEach(cat => categoryMap.set(cat.id, cat.name));

        // Mapeamos cada producto para añadirle el categoryName
        const productsWithCategoryName = products.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId) || 'Desconocida' // Nombre o 'Desconocida'
        }));

        return { loading: false, data: productsWithCategoryName, error: null };
      }),
      startWith({ loading: true, data: [], error: null }), // Estado inicial de carga
      catchError(error => {
        console.error('Error al cargar productos o categorías:', error);
        // Devolvemos un estado de error
        return of({ loading: false, data: [], error: 'Error al cargar los datos.' });
      })
    );
  }

  // Navegar a la página de edición
  navigateToEdit(productId: string | undefined): void {
    if (productId) {
      this.router.navigate(['/admin/products/edit', productId]);
    }
  }

  // Eliminar un producto
  async deleteProduct(productId: string | undefined): Promise<void> {
    if (!productId) return;

    // Confirmación simple (se puede mejorar con un modal)
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await this.productService.deleteProduct(productId);
        console.log('Producto eliminado:', productId);
        // No necesitamos recargar explícitamente aquí, Firestore debería actualizar la lista.
        // Si no lo hace, podríamos llamar a this.loadProductsWithCategories() de nuevo.
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto.'); // Mostrar error al usuario
      }
    }
  }
}
