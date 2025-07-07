import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';

// Modelos y Servicios
import { Product } from '../../../products/models/product.model'; // Ruta corregida
import { Category } from '../../../products/models/category.model'; // Ruta corregida
import { CategoryService } from '../../../../core/services/category.service'; // Ruta corregida

// Define la estructura del evento save
export interface ProductSaveEvent {
  productData: Partial<Product>;
  imageBase64: string | null;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  // Importamos solo las pipes y directivas necesarias (más eficiente que CommonModule)
  imports: [ReactiveFormsModule, AsyncPipe, NgClass],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'] // Corregido styleUrl a styleUrls
})
export class ProductFormComponent implements OnInit {
  // Input para recibir datos del producto existente (modo edición)
  @Input() product: Product | null = null;
  // Output para emitir los datos guardados
  @Output() save = new EventEmitter<ProductSaveEvent>();

  // Inyección de servicios
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  // FormGroup principal
  productForm!: FormGroup;
  // Observable para las categorías
  categories$: Observable<Category[]> = this.categoryService.getCategories();
  // ¿Estamos en modo edición?
  isEditMode = false;

  // Propiedades para manejo de imagen
  imagePreviewUrl: string | null = null; // Mantenemos para la vista previa
  selectedImageBase64: string | null = null; // NUEVO - para guardar la cadena Base64

  ngOnInit(): void {
    this.isEditMode = !!this.product; // True si se pasó un producto
    this.initForm();

    // Si estamos en modo edición, precargamos los datos
    if (this.isEditMode && this.product) {
      // Asegurarse que price sea number y no string (como podría venir de Firestore a veces)
      const formData = {
        ...this.product,
        price: Number(this.product.price) || 0, // Convertir a número
        stockQuantity: Number(this.product.stockQuantity) || 0 // Convertir a número
      };
      // Excluimos imageUrl ya que no está en el form
      delete formData.imageUrl;
      this.productForm.patchValue(formData);

      // Establecer la vista previa si hay una imagen existente
      if (this.product.imageUrl) {
        this.imagePreviewUrl = this.product.imageUrl;
      }
    }
  }

  // Inicializa la estructura del formulario
  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''], // Opcional
      price: [0, [Validators.required, Validators.min(0.01)]], // Precio > 0
      categoryId: ['', Validators.required], // ID de categoría es requerido
      stockQuantity: [0, [Validators.min(0)]], // Stock >= 0 (puede ser opcional si no se maneja stock)
      isDisabled: [false] // Por defecto, habilitado
      // Añadir más campos del modelo Product según necesidad (sku, brand, etc.)
    });
  }

  // Método que se llama al enviar el formulario
  onSubmit(): void {
    if (this.productForm.invalid) {
      console.error('Formulario inválido:', this.productForm.value);
      // Marcar todos los campos como 'touched' para mostrar errores
      this.productForm.markAllAsTouched();
      return;
    }

    const formData: Partial<Product> = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      stockQuantity: Number(this.productForm.value.stockQuantity)
      // imageUrl no se envía desde aquí, se manejará en el componente padre/servicio
    };

    console.log('Emitiendo datos guardados:', formData, 'Base64:', this.selectedImageBase64 ? this.selectedImageBase64.substring(0, 50) + '...' : 'null');
    // Emitir el evento con Base64
    this.save.emit({ productData: formData, imageBase64: this.selectedImageBase64 });
  }

  // Maneja la selección de archivo y convierte a Base64
  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      // Validar tamaño ANTES de leer (ejemplo: < 700KB para ser seguros con Base64 en Firestore)
      const maxSizeInBytes = 700 * 1024; // ~700 KB
      if (file.size > maxSizeInBytes) {
        console.error('Error: La imagen es demasiado grande. El límite es aprox. 700KB.');
        alert('Error: La imagen es demasiado grande. El límite es aprox. 700KB.');
        // Resetear el input para permitir seleccionar de nuevo si el usuario quiere
        element.value = "";
        this.selectedImageBase64 = null;
        this.imagePreviewUrl = this.isEditMode && this.product?.imageUrl ? this.product.imageUrl : null;
        return; // Detener proceso
      }

      const reader = new FileReader();
      reader.onload = () => {
        // Guardamos la cadena Base64 completa (incluye 'data:image/jpeg;base64,...')
        this.selectedImageBase64 = reader.result as string;
        this.imagePreviewUrl = this.selectedImageBase64; // Usar Base64 para preview
      };
      reader.onerror = (error) => {
         console.error('Error al leer el archivo:', error);
         this.selectedImageBase64 = null;
         this.imagePreviewUrl = this.isEditMode && this.product?.imageUrl ? this.product.imageUrl : null;
      };
      reader.readAsDataURL(file);

    } else {
      this.selectedImageBase64 = null; // Limpiar Base64
      // Volver a la imagen original si se cancela y estábamos editando
      this.imagePreviewUrl = this.isEditMode && this.product?.imageUrl ? this.product.imageUrl : null;
    }
  }

  // Helper para acceder fácilmente a los controles en el template (opcional)
  get f() { return this.productForm.controls; }
}
