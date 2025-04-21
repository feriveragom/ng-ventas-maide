import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap, catchError, of, combineLatest, map } from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';

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
    NgFor,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  
  public products$: Observable<ProductWithCategory[]>;
  public isLoading = true;
  public error: string | null = null;

  constructor() {
    this.products$ = of([]);
  }

  ngOnInit(): void {
    console.log('ProductListComponent: ngOnInit - Intentando obtener productos y categorías...');
    this.isLoading = true;
    this.error = null;

    // Usar combineLatest para obtener productos y categorías simultáneamente
    this.products$ = combineLatest([
      this.productService.getProducts(),
      this.categoryService.getCategories()
    ]).pipe(
      map(([products, categories]) => {
        // Crear mapa de categorías por ID
        const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
        
        // Añadir el nombre de la categoría a cada producto
        return products.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId) || 'Sin categoría'
        }));
      }),
      tap(productsWithCategory => {
        this.isLoading = false;
        console.log('ProductListComponent: Productos con categorías recibidos! 🎉', productsWithCategory);
        if (productsWithCategory.length === 0) {
          console.log('ProductListComponent: La lista de productos está vacía.');
        }
      }),
      catchError((err: any) => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar los productos o categorías.';
        console.error('ProductListComponent: Error al obtener productos/categorías 🚨', err);
        return of([]);
      })
    );
  }

  onImageError(event: Event): void {
    console.error('Error al cargar la imagen:', (event.target as HTMLImageElement).src);
  }
}
