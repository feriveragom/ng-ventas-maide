import { Component, OnInit, inject, OnDestroy, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Para navegación y routerLink
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { map, catchError, startWith, takeUntil, tap } from 'rxjs/operators';

// Modelos y Servicios
import { Product } from '../../../../products/models/product.model';
import { Category } from '../../../../products/models/category.model';
import { ProductService } from '../../../../products/services/product.service';
import { CategoryService } from '../../../../../core/services/category.service';

// Importaciones de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // Para posibles iconos
import { MatButtonModule } from '@angular/material/button'; // Para botones de acción

// Interfaz para los datos combinados
interface ProductWithCategory extends Product {
  categoryName?: string; // Nombre de la categoría opcional
}

// Estado para manejar carga/error/datos
interface ProductListState {
  loading: boolean;
  error: string | null;
  data: ProductWithCategory[];
}

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [
    // Solo importamos lo necesario en lugar de CommonModule
    CurrencyPipe, // Para el pipe de moneda en la tabla
    RouterModule, // Para routerLink
    // Módulos de Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
  // Optimización: Usar OnPush si los datos vienen de observables
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef); // Inyectar ChangeDetectorRef si usamos OnPush

  // Subject para manejar la desuscripción
  private destroy$ = new Subject<void>();

  // Columnas a mostrar en la tabla Material
  displayedColumns: string[] = ['imageUrl', 'name', 'categoryName', 'price', 'stockQuantity', 'actions'];
  // Fuente de datos para la tabla Material
  dataSource: MatTableDataSource<ProductWithCategory> = new MatTableDataSource<ProductWithCategory>([]);

  // Referencias al paginador y al ordenador
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Observable combinado para el estado
  productsWithCategories$!: Observable<ProductListState>;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Configuramos paginador y ordenador DESPUÉS de que la vista se inicialice
    // Usamos un setTimeout para evitar errores ExpressionChangedAfterItHasBeenChecked
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: ProductWithCategory, property: string) => {
        switch (property) {
          case 'categoryName': return item.categoryName ?? '';
          case 'price': return item.price ?? 0;
          case 'stockQuantity': return item.stockQuantity ?? 0;
          default: return (item as any)[property];
        }
      };
    });

    // Definir el predicado de filtro personalizado
    this.dataSource.filterPredicate = (data: ProductWithCategory, filter: string): boolean => {
      const filterText = filter.trim().toLowerCase();
      // Construir la cadena de búsqueda con los campos relevantes
      const dataStr = (
        (data.name ?? '') +
        (data.sku ?? '') +
        (data.categoryName ?? '') +
        (data.price?.toString() ?? '') +
        (data.stockQuantity?.toString() ?? '')
      ).toLowerCase();
      // Retorna true si la cadena de datos incluye el texto del filtro
      return dataStr.includes(filterText);
    };
  }

  loadData(): void {
    this.productsWithCategories$ = combineLatest([
      this.productService.getProducts(),
      this.categoryService.getCategories()
    ]).pipe(
      map(([products, categories]: [Product[], Category[]]) => {
        const categoryMap = new Map(categories.map((cat: Category) => [cat.id, cat.name]));
        const data: ProductWithCategory[] = products.map((product: Product) => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId)
        }));
        this.dataSource.data = data;
        return { loading: false, error: null, data: data };
      }),
      startWith({ loading: true, error: null, data: [] }), // Estado inicial de carga
      catchError(err => {
        console.error('Error fetching products or categories:', err);
        return of({ loading: false, error: 'No se pudieron cargar los datos.', data: [] });
      }),
      takeUntil(this.destroy$) // Desuscribirse al destruir el componente
    );

    // Nos suscribimos aquí solo para inicializar el flujo,
    // pero usaremos el async pipe en la plantilla para manejar el estado.
    this.productsWithCategories$.subscribe();
  }

  // Método para filtrar la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Navegar a la página de edición
  navigateToEdit(id: string): void {
    this.router.navigate(['./edit', id], { relativeTo: this.router.routerState.root.firstChild?.firstChild?.firstChild }); // Ajustar relativeTo según estructura de rutas
     // O simplemente: this.router.navigate(['/admin/products/edit', id]);
  }

  // Eliminar un producto
  async deleteProduct(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await this.productService.deleteProduct(id);
        // TODO: Añadir notificación de éxito (ej: snackbar)
        // Opcional: Recargar datos explícitamente si la actualización automática no es suficiente
        // this.loadData(); // O encontrar forma más eficiente de quitar el item del dataSource
      } catch (error) {
        console.error('Error deleting product:', error);
        // TODO: Añadir notificación de error
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
