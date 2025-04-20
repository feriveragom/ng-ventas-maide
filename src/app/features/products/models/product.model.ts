export interface Product {
  /** Identificador único del documento en Firestore. Generado automáticamente por Firestore. */
  id?: string;

  /** Nombre principal y descriptivo del producto. Campo obligatorio. */
  name: string;

  /** Descripción detallada del producto, características, uso, etc. */
  description?: string;

  /** Precio de venta estándar del producto. Campo obligatorio. */
  price: number;

  /** ID del documento de la categoría (de la colección 'categories') a la que pertenece el producto. Campo obligatorio. */
  categoryId: string;

  /** Subcategoría para una clasificación más específica dentro de la categoría principal (ej: 'Camisas'). */
  subCategory?: string;

  /** Marca o fabricante del producto. */
  brand?: string;

  /** Modelo específico del producto, si aplica (ej: 'iPhone 15 Pro'). */
  model?: string;

  /** Stock Keeping Unit: Código único de referencia de inventario. */
  sku?: string;

  /** URL de la imagen principal que representa al producto. */
  imageUrl?: string;

  /** Array de URLs para imágenes adicionales del producto (galería). */
  galleryImageUrls?: string[];

  /** Cantidad de unidades disponibles en stock. Útil para controlar disponibilidad. */
  stockQuantity?: number;

  /** Indicador booleano para saber si el producto está actualmente en oferta. */
  isOnSale?: boolean;

  /** Precio especial si el producto está en oferta (`isOnSale` es true). */
  salePrice?: number;

  /** Array de etiquetas o palabras clave para facilitar búsquedas y filtros. */
  tags?: string[];

  /** Objeto flexible para almacenar especificaciones técnicas clave-valor (ej: {'Color': 'Rojo', 'Material': 'Algodón'}). */
  technicalSpecifications?: { [key: string]: string };

  /** Fecha y hora de creación del registro del producto. Firestore usa Timestamps. */
  createdAt?: Date | any; // O usar directamente firebase.firestore.Timestamp si se importa

  /** Fecha y hora de la última modificación del registro del producto. Firestore usa Timestamps. */
  updatedAt?: Date | any; // O usar directamente firebase.firestore.Timestamp si se importa

  /** Indicador booleano para deshabilitar/ocultar un producto del catálogo sin borrarlo (ej: true si está deshabilitado). */
  isDisabled?: boolean;
} 