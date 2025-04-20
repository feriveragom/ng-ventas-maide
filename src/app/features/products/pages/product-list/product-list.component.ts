import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

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
  public products$: Observable<Product[]>;
  public isLoading = true;
  public error: string | null = null;

  constructor() {
    this.products$ = of([]);
  }

  ngOnInit(): void {
    console.log('ProductListComponent: ngOnInit - Intentando obtener productos...');
    this.isLoading = true;
    this.error = null;

    this.products$ = this.productService.getProducts().pipe(
      tap(products => {
        this.isLoading = false;
        console.log('ProductListComponent: Productos recibidos! 🎉', products);
        if (products.length === 0) {
          console.log('ProductListComponent: La lista de productos está vacía.');
        }
      }),
      catchError(err => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar los productos.';
        console.error('ProductListComponent: Error al obtener productos 🚨', err);
        return of([]);
      })
    );
  }

  onImageError(event: Event): void {
    console.error('Error al cargar la imagen:', (event.target as HTMLImageElement).src);
  }
}
