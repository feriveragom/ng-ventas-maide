import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor en el template
import { Observable } from 'rxjs';

// Modelos y Servicios
import { Product } from '../../../products/models/product.model'; // Ruta corregida
import { Category } from '../../../products/models/category.model'; // Ruta corregida
import { CategoryService } from '../../../../core/services/category.service'; // Ruta corregida

@Component({
  selector: 'app-product-form',
  standalone: true,
  // Importamos módulos necesarios para el template (Formularios Reactivos y directivas comunes)
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'] // Corregido styleUrl a styleUrls
})
export class ProductFormComponent implements OnInit {
  // Input para recibir datos del producto existente (modo edición)
  @Input() product: Product | null = null;
  // Output para emitir los datos guardados
  @Output() save = new EventEmitter<Partial<Product>>(); // Emitimos Partial<Product> para flexibilidad

  // Inyección de servicios
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  // FormGroup principal
  productForm!: FormGroup;
  // Observable para las categorías
  categories$: Observable<Category[]> = this.categoryService.getCategories();
  // ¿Estamos en modo edición?
  isEditMode = false;

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
      this.productForm.patchValue(formData);
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
      imageUrl: [''], // Opcional, podríamos añadir validación de URL
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

    console.log('Emitiendo datos guardados:', this.productForm.value);
    // Convertimos explícitamente a Partial<Product> para asegurar el tipo
    const formData: Partial<Product> = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      stockQuantity: Number(this.productForm.value.stockQuantity)
    };
    this.save.emit(formData); // Ahora formData es explícitamente Partial<Product>
  }

  // Helper para acceder fácilmente a los controles en el template (opcional)
  get f() { return this.productForm.controls; }
}
