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
  DocumentReference,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; // Asegúrate que la ruta sea correcta

@Injectable({
  providedIn: 'root', // Servicio disponible en toda la aplicación
})
export class ProductService {
  // Inyectamos Firestore usando la nueva función inject() de Angular
  private firestore: Firestore = inject(Firestore);

  // Creamos una referencia tipada a la colección 'products'
  private productsCollection: CollectionReference<Product>;

  constructor() {
    // Especificamos que la colección 'products' contiene documentos de tipo 'Product'
    // Nota: Firestore no valida esto en tiempo de ejecución, es para ayuda en desarrollo (tipado)
    this.productsCollection = collection(this.firestore, 'products') as CollectionReference<Product>;
  }

  /**
   * Obtiene un Observable que emite un array de todos los productos
   * de la colección 'products' en Firestore.
   * Incluye el ID del documento en cada objeto producto.
   * @returns Observable<Product[]>
   */
  getProducts(): Observable<Product[]> {
    // collectionData permite obtener los datos de la colección como un Observable.
    // La opción { idField: 'id' } es crucial: mapea automáticamente el ID
    // del documento de Firestore al campo 'id' de nuestra interfaz Product.
    return collectionData<Product>(this.productsCollection, { idField: 'id' });
  }

  /** Obtiene un producto específico por su ID */
  getProductById(id: string): Observable<Product | undefined> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    // docData emite el documento o undefined si no existe.
    // Incluimos idField para asegurar que el ID esté en el objeto emitido.
    return docData<Product>(productDocRef as DocumentReference<Product>, { idField: 'id' });
  }

  /** Añade un nuevo producto a la colección */
  addProduct(productData: Omit<Product, 'id'>): Promise<DocumentReference<Product>> {
    // addDoc añade un nuevo documento con un ID generado automáticamente.
    // Asegúrate que los datos en productData coincidan con la interfaz Product (excepto 'id').
    // Podríamos añadir timestamps aquí si es necesario (ej. { ...productData, createdAt: serverTimestamp() })
    return addDoc(this.productsCollection, productData);
  }

  /** Actualiza un producto existente */
  updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    // updateDoc actualiza los campos especificados en productData.
    // Usa Partial<Product> para permitir actualizaciones parciales.
    // Podríamos añadir un timestamp de actualización aquí (ej. { ...productData, updatedAt: serverTimestamp() })
    return updateDoc(productDocRef as DocumentReference<Product>, productData);
  }

  /** Elimina un producto por su ID */
  deleteProduct(id: string): Promise<void> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(productDocRef);
  }
}
