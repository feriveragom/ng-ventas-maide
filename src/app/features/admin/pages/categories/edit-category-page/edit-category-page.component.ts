import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, of, catchError, tap } from 'rxjs';

import { CategoryFormComponent } from '../category-form.component';
import { CategoryService } from '../../../../../core/services/category.service';
import { Category } from '../../../../products/models/category.model';

@Component({
  selector: 'app-edit-category-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './edit-category-page.component.html',
  styleUrls: ['./edit-category-page.component.scss']
})
export class EditCategoryPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  isLoading = false;
  isFetching = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  category$!: Observable<Category | null | undefined>;
  private categoryId: string | null = null;

  ngOnInit(): void {
    this.category$ = this.route.paramMap.pipe(
      tap(() => this.isFetching = true),
      switchMap(params => {
        this.categoryId = params.get('id');
        if (!this.categoryId) {
          this.errorMessage = 'No se proporcionó ID de categoría.';
          console.error('ID de categoría no encontrado en la ruta');
          return of(null);
        }
        return this.categoryService.getCategoryById(this.categoryId!).pipe(
          catchError((err: any) => {
            console.error('Error al buscar la categoría:', err);
            this.errorMessage = 'Error al cargar la categoría.';
            return of(null);
          })
        );
      }),
      tap(() => this.isFetching = false)
    );
  }

  async handleSave(categoryData: Partial<Category>): Promise<void> {
    if (!this.categoryId) {
      this.errorMessage = 'Error: No se encontró el ID de la categoría para actualizar.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      await this.categoryService.updateCategory(this.categoryId!, categoryData);
      this.successMessage = '¡Categoría actualizada exitosamente!';
      this.isLoading = false;
      setTimeout(() => this.router.navigate(['/admin/categories']), 1500);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = `Error al actualizar la categoría: ${error?.message || 'Error desconocido'}`;
      console.error('Error en handleSave (Edit Category):', error);
    }
  }
}
