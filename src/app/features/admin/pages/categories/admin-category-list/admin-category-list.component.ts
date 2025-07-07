import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, catchError, of, startWith, map } from 'rxjs';

// Modelos y Servicios
import { Category } from '../../../../products/models/category.model';
import { CategoryService } from '../../../../../core/services/category.service';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './admin-category-list.component.html',
  styleUrls: ['./admin-category-list.component.scss']
})
export class AdminCategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // Observable para el estado de las categorías
  categoriesState$!: Observable<{ loading: boolean; data: Category[]; error: string | null }>;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesState$ = this.categoryService.getCategories().pipe(
      map((categories: Category[]) => ({ loading: false, data: categories, error: null })),
      startWith({ loading: true, data: [], error: null }),
      catchError((error: any) => {
        console.error('Error al cargar categorías:', error);
        return of({ loading: false, data: [], error: 'Error al cargar las categorías.' });
      })
    );
  }

  // Navegar a la página de edición
  navigateToEdit(categoryId: string | undefined): void {
    if (categoryId) {
      this.router.navigate(['/admin/categories/edit', categoryId]);
    }
  }

  // Eliminar una categoría
  async deleteCategory(categoryId: string | undefined): Promise<void> {
    if (!categoryId) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? (Esto podría afectar a productos existentes)')) {
      try {
        await this.categoryService.deleteCategory(categoryId);
        console.log('Categoría eliminada:', categoryId);
        // Firestore debería actualizar la lista automáticamente
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Error al eliminar la categoría.');
      }
    }
  }
}
