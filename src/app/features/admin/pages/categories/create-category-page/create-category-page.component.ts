import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryFormComponent } from '../category-form.component';
import { CategoryService } from '../../../../../core/services/category.service';
import { Category } from '../../../../products/models/category.model';

@Component({
  selector: 'app-create-category-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.scss']
})
export class CreateCategoryPageComponent {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  async handleSave(categoryData: Partial<Category>): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const dataToSave: Omit<Category, 'id'> = {
        name: categoryData.name || ''
      };
      const docRef = await this.categoryService.addCategory(dataToSave);
      this.successMessage = 'Categoría creada exitosamente!';
      this.isLoading = false;
      setTimeout(() => this.router.navigate(['/admin/categories']), 1500);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = `Error al crear la categoría: ${error?.message || 'Error desconocido'}`;
      console.error('Error en handleSave (Category):', error);
    }
  }
}
