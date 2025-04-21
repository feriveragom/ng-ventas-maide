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

  /**
   * Añade un nuevo producto a la colección (incluyendo imageUrl si se proporciona).
   * @param productData Los datos del producto (sin id), puede incluir imageUrl (Base64).
   * @returns Promise<DocumentReference<Product>> Referencia al documento creado.
   */
  addProduct(productData: Omit<Product, 'id'>): Promise<DocumentReference<Product>> {
    // Simplemente añade los datos tal como vienen (incluyendo imageUrl si existe)
    console.log('Añadiendo producto a Firestore:', { ...productData, imageUrl: productData.imageUrl ? productData.imageUrl.substring(0, 50) + '...' : 'null' });
    return addDoc(this.productsCollection, productData);
  }

  /**
   * Actualiza un producto existente (incluyendo imageUrl si se proporciona).
   * @param id El ID del producto a actualizar.
   * @param productData Los datos parciales del producto a actualizar, puede incluir imageUrl (Base64).
   * @returns Promise<void>
   */
  updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    const productDocRef = doc(this.firestore, `products/${id}`) as DocumentReference<Product>;
    console.log('Actualizando producto en Firestore:', id, { ...productData, imageUrl: productData.imageUrl ? productData.imageUrl.substring(0, 50) + '...' : 'null/undefined' });
    // Simplemente actualiza los campos proporcionados en productData
    return updateDoc(productDocRef, productData);
  }

  /** Elimina un producto por su ID */
  deleteProduct(id: string): Promise<void> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    // TODO: Si estamos usando Base64, no hay imagen externa que borrar.
    // Pero si eventualmente se vuelve a Cloud Storage, habría que añadir aquí
    // la lógica para obtener la imageUrl del producto y borrarla de Storage.
    return deleteDoc(productDocRef);
  }
}
