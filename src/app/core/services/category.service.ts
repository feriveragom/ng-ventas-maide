import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../features/products/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private firestore: Firestore = inject(Firestore);
  private categoriesCollection: CollectionReference<Category>;

  constructor() {
    this.categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
  }

  /**
   * Obtiene un Observable que emite un array de todas las categorías
   * ordenadas por nombre.
   * Incluye el ID del documento en cada objeto categoría.
   * @returns Observable<Category[]>
   */
  getCategories(): Observable<Category[]> {
    const q = query(this.categoriesCollection, orderBy('name'));

    return collectionData<Category>(q, { idField: 'id' });
  }

  /** Obtiene una categoría específica por su ID */
  getCategoryById(id: string): Observable<Category | undefined> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return docData<Category>(categoryDocRef as DocumentReference<Category>, { idField: 'id' });
  }

  /** Añade una nueva categoría */
  addCategory(categoryData: Omit<Category, 'id'>): Promise<DocumentReference<Omit<Category, 'id'>>> {
    // Asegúrate que los datos (probablemente solo { name: '...' }) coincidan
    return addDoc(this.categoriesCollection, categoryData);
  }

  /** Actualiza una categoría existente */
  updateCategory(id: string, categoryData: Partial<Category>): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return updateDoc(categoryDocRef as DocumentReference<Category>, categoryData);
  }

  /** Elimina una categoría por su ID */
  deleteCategory(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDocRef);
  }
}
