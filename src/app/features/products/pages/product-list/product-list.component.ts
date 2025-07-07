import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap, catchError, of, combineLatest, map, switchMap, BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../../core/services/category.service';

// Interfaz local para combinar datos
interface ProductWithCategory extends Product {
  categoryName?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  public products$: Observable<ProductWithCategory[]>;
  public categories$: Observable<Category[]>;
  public isLoading = true;
  public error: string | null = null;

  // BehaviorSubject para manejar el filtro de categoría seleccionado
  private selectedCategoryId$ = new BehaviorSubject<string | undefined>(undefined);
  public selectedCategoryId: string | undefined = undefined;

  constructor() {
    this.products$ = of([]);
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    // Observable de categorías
    this.categories$ = this.categoryService.getCategories().pipe(
      catchError((err) => {
        console.error('Error al cargar categorías:', err);
        return of([]);
      })
    );

    // Combinar el filtro de categoría con los productos usando switchMap
    this.products$ = this.selectedCategoryId$.pipe(
      switchMap((categoryId) => {
        // Combinar productos filtrados con categorías
        return combineLatest([
          this.productService.getEnabledProducts(categoryId),
          this.categories$
        ]);
      }),
      map(([products, categories]) => {
        // Crear mapa de categorías por ID
        const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

        // Añadir el nombre de la categoría a cada producto
        return products.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId) || 'Sin categoría'
        }));
      }),
      tap(() => {
        this.isLoading = false;
      }),
      catchError((err: any) => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar los productos o categorías.';
        console.error('Error al obtener productos/categorías:', err);
        return of([]);
      })
    );
  }

  /**
   * Maneja el cambio de filtro de categoría
   * @param event - Evento del select
   */
  onCategoryFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const rawValue = selectElement.value;
    // Si el valor es string vacío, lo convertimos a undefined
    const categoryId = (rawValue && rawValue.trim() !== '') ? rawValue : undefined;

    this.selectedCategoryId = categoryId;
    this.selectedCategoryId$.next(categoryId);
  }

  onImageError(event: Event): void {
    // Opcional: Manejar errores de imagen de manera silenciosa
    // o mostrar imagen por defecto
  }
}
