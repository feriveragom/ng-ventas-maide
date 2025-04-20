import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf

// Componentes y Servicios
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
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
  async handleSave(productData: Partial<Product>): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    console.log('Recibido para guardar:', productData);

    try {
      // Llamamos al servicio para añadir el producto
      // Asegurarse de que productData sea compatible con Omit<Product, 'id'>
      // Si 'id' viene en productData (aunque no debería desde el form), hay que quitarlo.
      // Por simplicidad ahora, asumimos que el form no genera 'id'.
      const docRef = await this.productService.addProduct(productData as Omit<Product, 'id'>);
      console.log('Producto añadido con ID:', docRef.id);
      this.successMessage = '¡Producto creado exitosamente!';
      this.isLoading = false;

      // Opcional: Redirigir a la lista de admin después de un breve retraso
      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 1500); // Espera 1.5 segundos

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = `Error al crear el producto: ${error?.message || 'Error desconocido'}`;
      console.error('Error en handleSave:', error);
    }
  }
}
