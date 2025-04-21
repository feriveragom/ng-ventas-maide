import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ProductService } from '../../../../products/services/product.service';
import { Product } from '../../../../products/models/product.model';
import { ProductFormComponent, ProductSaveEvent } from '../../../components/product-form/product-form.component';

@Component({
  selector: 'app-edit-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './edit-product-page.component.html',
  styleUrl: './edit-product-page.component.scss'
})
export class EditProductPageComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);

  product$: Observable<Product | null | undefined>;
  errorMessage: string | null = null;

  isUpdating = false;
  updateError: string | null = null;
  updateSuccess = false;

  constructor() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.productService.getProductById(id).pipe(
            catchError((err: any) => {
              console.error('Error fetching product:', err);
              this.errorMessage = `Error al cargar el producto: ${err?.message || 'Error desconocido'}. ¿Existe el ID '${id}'?`;
              return of(null);
            })
          );
        } else {
          this.errorMessage = 'No se proporcionó un ID de producto en la ruta.';
          return of(null);
        }
      })
    );
  }

  async handleSave(event: ProductSaveEvent): Promise<void> {
    const { productData, imageBase64 } = event;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.updateError = 'No se pudo obtener el ID del producto para la actualización.';
      console.error('Product ID is missing from route snapshot in handleSave');
      return;
    }

    this.isUpdating = true;
    this.updateError = null;
    this.updateSuccess = false;

    const dataToUpdate: Partial<Product> = {
      ...productData,
      ...(imageBase64 !== null && { imageUrl: imageBase64 }),
    };

    if (dataToUpdate.imageUrl === undefined) {
        delete dataToUpdate.imageUrl;
    }

    try {
      await this.productService.updateProduct(id, dataToUpdate);
      this.updateSuccess = true;
      this.isUpdating = false;
      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 1500);

    } catch (error: any) {
      this.isUpdating = false;
      if (error.message?.includes('maximum size')) {
         this.updateError = 'Error: El tamaño total del producto (incluyendo la nueva imagen) excede el límite de Firestore (1MB). Intenta con una imagen más pequeña.';
      } else {
         this.updateError = `Error al actualizar el producto: ${error?.message || 'Error desconocido'}`;
      }
      console.error('Error in handleSave (Product Update):', error);
    }
  }
}
