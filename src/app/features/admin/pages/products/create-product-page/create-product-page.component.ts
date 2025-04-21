import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf

// Componentes y Servicios
import { ProductFormComponent, ProductSaveEvent } from '../../../components/product-form/product-form.component';
import { ProductService } from '../../../../products/services/product.service'; // Ajustar ruta
import { Product } from '../../../../products/models/product.model'; // Ajustar ruta

@Component({
  selector: 'app-create-product-page',
  standalone: true,
  // Importar CommonModule y el ProductFormComponent
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss'] // Corregido styleUrl a styleUrls
})
export class CreateProductPageComponent {
  // Inyección de servicios
  private productService = inject(ProductService);
  private router = inject(Router);

  // Flags de estado para UI
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Método llamado cuando ProductFormComponent emite el evento (save)
  async handleSave(event: ProductSaveEvent): Promise<void> {
    const { productData, imageBase64 } = event;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    console.log('Recibido para guardar:', productData, 'Base64:', imageBase64 ? imageBase64.substring(0, 50)+'...': 'null');

    // Preparamos los datos finales para Firestore
    const finalProductData: Omit<Product, 'id'> = {
      ...(productData as Omit<Product, 'id'>),
      imageUrl: imageBase64 ?? undefined // Añadir Base64 como imageUrl (o undefined si es null)
    };

    try {
      // Pasar los datos combinados al servicio
      const docRef = await this.productService.addProduct(finalProductData);
      console.log('Producto añadido con ID:', docRef.id);

      this.successMessage = '¡Producto creado exitosamente!';
      this.isLoading = false;

      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 1500);

    } catch (error: any) {
      this.isLoading = false;
      // Considerar error específico si falla por tamaño de documento (Firestore 1MB limit)
      if (error.message?.includes('maximum size')) {
         this.errorMessage = 'Error: El tamaño total del producto (incluyendo la imagen) excede el límite de Firestore (1MB). Intenta con una imagen más pequeña.';
      } else {
        this.errorMessage = `Error al crear el producto: ${error?.message || 'Error desconocido'}`;
      }
      console.error('Error en handleSave:', error);
    }
  }
}
