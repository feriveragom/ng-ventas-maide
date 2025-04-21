# 🛍️ ng-ventas-maide: Catálogo Digital de Productos

**URL de Despliegue:** [https://ng-ventas-maide.web.app/](https://ng-ventas-maide.web.app/)

## 📚 Introducción

`ng-ventas-maide` es una aplicación web de catálogo de productos desarrollada con Angular 19. Este proyecto tiene un propósito fundamentalmente académico, diseñado para explorar, implementar y demostrar las capacidades avanzadas del framework Angular moderno, incluyendo el uso de Signals para la gestión del estado y Lazy Loading para la optimización del rendimiento.

### 🎯 Objetivos Específicos

1.  **Desarrollar un Catálogo Digital:** Crear una interfaz responsive y funcional para la visualización de productos categorizados (belleza, ropa, calzado, aseo).
2.  **Implementar Funcionalidades Clave:** Construir un sistema robusto para la visualización de productos, autenticación de usuarios y gestión administrativa básica.
3.  **Establecer una Arquitectura Escalable:** Diseñar una base de código modular y mantenible que facilite la incorporación de futuras funcionalidades.
4.  **Servir como Referencia Educativa:** Demostrar la aplicación de buenas prácticas y patrones de diseño en el desarrollo con Angular, incluyendo la reutilización de componentes y módulos.

### ✨ Características Destacadas

*   **Catálogo Público:** Visualización accesible y responsive de productos para todos los visitantes.
*   **Diseño Responsive:** Adaptación fluida a diferentes tamaños de pantalla utilizando Angular Material y **TailwindCSS**.
*   **Interfaz Moderna:** Tema claro (fondo blanco, acentos amarillo/negro) para una experiencia de usuario limpia.
*   **Autenticación (Parcialmente Integrada):** Sistema de autenticación (inicio de sesión) basado en **Firebase Authentication**. La integración de registro y recuperación de contraseña, reutilizada de `ng-shape-up`, está pendiente o en progreso.
    *   *Credenciales de Prueba (Superusuario):* `superusuario@firebase.com` / `firebase.com`
*   **Gestión de Productos y Categorías:**
    *   Funcionalidad **CRUD** (Crear, Leer, Actualizar, Eliminar) implementada para **productos** y **categorías** utilizando **Cloud Firestore** como backend.
    *   Interfaz de administración con **tablas avanzadas (`MatTable`)** que incluyen **filtrado**, **ordenación** por columnas y **paginación**.
    *   Diseño **responsive** para las tablas de administración, permitiendo **scroll horizontal** en pantallas pequeñas.

## 🛠️ Especificaciones Técnicas

### Stack Tecnológico Principal

*   **Framework Frontend:** Angular 19
*   **Plataforma Backend (BaaS):** Firebase
    *   **Base de Datos:** Cloud Firestore
    *   **Autenticación:** Firebase Authentication
    *   **Hosting:** Firebase Hosting
    *   **CI/CD:** GitHub Actions (integración con Firebase Hosting)
*   **Framework UI:** Angular Material
*   **Utilidades CSS:** TailwindCSS
*   **Gestión de Estado:** Angular Signals

### Aspectos Técnicos Relevantes

*   **Arquitectura Modular:** Implementación de **Lazy Loading** para los módulos principales (`products`, `admin`) y componentes individuales (ej. `LoginComponent`), optimizando la carga inicial.
*   **Gestión de Estado Reactiva:** Uso de **Signals** para la gestión del estado local de los componentes y **RxJS (Observables, combineLatest, forkJoin)** para manejar flujos de datos asíncronos desde Firebase.
*   **Diseño Adaptativo:** Enfoque "Mobile-First" utilizando **TailwindCSS** y componentes responsivos de Angular Material, garantizando una experiencia óptima en dispositivos móviles y de escritorio.
*   **Integración con Firebase:** Aprovechamiento completo de los servicios de Firebase para base de datos (**Cloud Firestore** para productos, categorías, etc.), autenticación (**Firebase Authentication** para gestión de usuarios) y hosting (**Firebase Hosting** para despliegue).
*   **Componentes UI Avanzados:** Uso de **Angular Material**, destacando `MatTable` para la visualización y gestión de datos tabulares con funcionalidades interactivas (sort, paginación, filtro).
*   **Seguridad Frontend:** Implementación de **rutas protegidas** (`CanActivate`) utilizando `authGuard` para restringir el acceso a secciones administrativas (`/admin`) solo a usuarios autenticados.
*   **Testing:** Configuración simplificada (enfoque en desarrollo, sin archivos `.spec` por defecto).

## 🏗️ Arquitectura del Proyecto

La estructura del proyecto sigue las convenciones recomendadas por Angular, promoviendo la modularidad y la separación de responsabilidades.

### Estructura de Directorios (src/app)

```
app/
├── core/                 # Módulos Core (singleton services, interceptors, guards)
│   └── services/         # Servicios transversales (e.g., FirebaseService, AuthService)
├── features/             # Módulos funcionales (cargados mediante Lazy Loading)
│   ├── products/         # Funcionalidad relacionada con el catálogo de productos (CRUD, visualización)
│   ├── admin/            # Panel de administración (gestión de usuarios/roles)
│   └── auth/             # Módulo de autenticación (login, registro, recuperación)
├── shared/               # Componentes, directivas, pipes y modelos compartidos
└── layouts/              # Componentes estructurales y plantillas principales (e.g., header, footer, sidebar)
```
*Nota: La configuración de Firebase y entornos se maneja en directorios específicos fuera de `app/`.*

### Flujo de Datos y Estado

*   **Estado Local:** Gestionado principalmente con Angular Signals dentro de los componentes.
*   **Persistencia de Datos:** Cloud Firestore actúa como el almacén de datos principal.
*   **Autenticación:** Firebase Authentication gestiona la identidad y sesión del usuario.
*   **Comunicación Asíncrona:** Uso de Observables (RxJS) para manejar flujos de datos provenientes de Firebase y otros eventos asíncronos.

## 🎓 Propósito Educativo

Este proyecto sirve como un caso de estudio práctico para ilustrar varios conceptos clave de Angular y Firebase:

*   **Angular Signals:** Demostración de la nueva API reactiva para la gestión del estado.
*   **Lazy Loading:** Aplicación de la carga diferida de módulos para optimizar el rendimiento.
*   **Inyección de Dependencias:** Uso efectivo del sistema de DI de Angular.
*   **Arquitectura de Componentes:** Distinción entre componentes inteligentes (contenedores) y presentacionales (tontos).
*   **Reutilización de Código:** Integración de módulos y servicios preexistentes (`ng-shape-up`).
*   **Firebase Integration:** Configuración y uso de Firestore, Authentication y Hosting.

## 🚀 Instalación y Ejecución Local

### Prerrequisitos

*   Node.js (versión LTS recomendada)
*   npm (incluido con Node.js) o yarn
*   Angular CLI (v19 o superior): `npm install -g @angular/cli`
*   Firebase CLI: `npm install -g firebase-tools`

### Pasos

1.  **Crear Proyecto Angular (si no existe):**
    ```bash
    # Navega al directorio donde quieres crear el proyecto
    # cd ruta/a/tu/espacio/de/trabajo
    # Crea el proyecto (responde a las preguntas sobre routing -Yes- y formato de estilos -SCSS-)
    ng new ng-ventas-maide
    cd ng-ventas-maide
    ```
2.  **Configurar Firebase (Consola Web):**
    *   **Creación del Proyecto:** Crear un nuevo proyecto en la [Firebase Console](https://console.firebase.google.com/). Usar ID `ng-ventas-maide` (o similar). Deshabilitar Google Analytics (opcional).
    *   **Habilitar Servicios:**
        *   **Cloud Firestore:** Crear base de datos (`(default)`), ubicación `southamerica-west1` (o la más cercana), modo **producción**.
        *   **Authentication:** Habilitar proveedor **"Correo electrónico/Contraseña"**.
    *   **Registrar Aplicación Web:** Añadir app web (`</>`), apodo `ng-ventas-maide-web`, **no** marcar Hosting. Registrar.
    *   **Obtener Configuración SDK:** Copiar el objeto `firebaseConfig`.
3.  **Integrar Configuración Firebase en Angular:**
    *   Crear/editar `src/environments/environment.ts` y `src/environments/environment.prod.ts`.
    *   Añadir la propiedad `firebase: { ... }` con el `firebaseConfig` copiado en ambos archivos (ajustando `production: true/false`).
4.  **Instalar Dependencias Principales:**
    ```bash
    npm install
    ```
5.  **Instalar AngularFire:**
    ```bash
    npm install @angular/fire
    ```
6.  **Configurar AngularFire en la App:**
    *   Editar `src/app/app.config.ts`.
    *   Importar `provideFirebaseApp`, `initializeApp`, `provideAuth`, `getAuth`, `provideFirestore`, `getFirestore` y `environment`.
    *   Añadir `provideFirebaseApp(() => initializeApp(environment.firebase))`, `provideAuth(() => getAuth())`, y `provideFirestore(() => getFirestore())` al array `providers`.
7.  **Configurar Firebase CLI (Opcional, para despliegue futuro):**
    ```bash
    firebase login
    firebase use --add
    # Seleccionar proyecto 'ng-ventas-maide', alias 'default' o 'prod'
    ```
8.  **Iniciar Servidor de Desarrollo:**
    ```bash
    ng serve -o
    ```
    La aplicación estará disponible en `http://localhost:4200/`.

### Despliegue en Firebase

1.  **Construir para Producción:**
    ```bash
    ng build --configuration production
    ```
2.  **Desplegar:**
    ```bash
    firebase deploy --only hosting
    ```
    *Nota: Asume que Firebase Hosting y CI/CD (GitHub Actions) están configurados, similar a `ng-shape-up`, pero apuntando a este nuevo proyecto Firebase.*

## 🗺️ Fases y Roadmap

El desarrollo se organiza en las siguientes fases:

### Fase 1 (En Curso)

*   [x] Estructura base del proyecto y configuración inicial.
*   [x] Configuración del proyecto Firebase (Firestore, Auth).
*   [x] Integración de la configuración de Firebase en Angular.
*   [x] Diseño responsive y tema visual (Material/Tailwind).
*   [x] Implementación del catálogo público de productos (visualización con categorías y estado de stock).
*   [ ] Adaptación e integración del módulo de autenticación reutilizado de `ng-shape-up` (Login funcional, Registro/Recuperación pendientes).
*   [ ] Adaptación e integración del panel de administración de usuarios/roles reutilizado de `ng-shape-up`.
*   [x] Desarrollo de la funcionalidad CRUD para productos y categorías (Firestore, formularios básicos).
*   [x] Implementación de tablas avanzadas (`MatTable`) para gestión de productos/categorías.
*   [ ] Configuración del despliegue continuo en Firebase (GitHub Actions).

### Fase 2 (Futura)

*   [ ] Implementación de sistema de búsqueda avanzada y filtros en el catálogo.
*   [ ] Categorización y organización avanzada de productos.
*   [ ] Sistema de notificaciones promocionales (genéricas y personalizadas para usuarios autenticados).
*   [ ] Sistema de ofertas, descuentos o programas de fidelización.
*   [ ] Optimización avanzada de imágenes y rendimiento (Core Web Vitals).
*   [ ] Implementación de métricas de uso y rendimiento con Firebase Analytics.
*   [ ] Configuración de backups automatizados para Firestore.

## 📱 Diseño y Experiencia de Usuario (UI/UX)

### Guía de Estilo Visual

*   **Tema:** Claro (fondo blanco).
*   **Paleta de Colores:** Acentos principales en Amarillo y Negro.
*   **Framework UI:** Componentes de Angular Material.
*   **Utilidades CSS:** TailwindCSS para estilos personalizados y layout.

### Consideraciones Responsive

*   **Enfoque:** Mobile-First.
*   **Layouts:** Uso de grids y flexbox adaptativos para el catálogo y otros elementos.
*   **Navegación:** Menús colapsables y patrones de navegación adaptados a móviles.
*   **Media:** Optimización de imágenes para diferentes resoluciones.

## 📖 Guía de Desarrollo Interno

### Convenciones de Código

*   Adherencia estricta a la [Guía de Estilo de Angular](https://angular.io/guide/styleguide).
*   Nomenclatura clara, descriptiva y consistente para archivos, clases, variables y funciones.
*   Uso de comentarios JSDoc para documentar interfaces públicas de clases y métodos complejos.
*   Adopción de [Commits Semánticos](https://www.conventionalcommits.org/) para el historial de Git.

### Buenas Prácticas

*   **Componentes:** Favorecer componentes pequeños, enfocados y reutilizables (principio de responsabilidad única). Separación clara entre componentes de presentación y contenedores.
*   **Módulos:** Uso extensivo de Lazy Loading para optimizar la carga de la aplicación.
*   **Estado:** Utilizar Signals para el estado local y servicios para el estado compartido o global.
*   **Servicios:** Centralizar la lógica de negocio, acceso a datos y llamadas a API en servicios inyectables.
*   **Tipado:** Utilizar interfaces y tipos de TypeScript para asegurar la robustez del código.
*   **RxJS:** Emplear operadores de RxJS de manera eficiente para la gestión de flujos asíncronos.

## 🔄 Flujo de Trabajo (Workflow)

### Ciclo de Desarrollo

1.  **Gestión de Ramas:** Crear ramas específicas para cada `feature` o `bugfix` a partir de la rama principal (`main` o `develop`).
2.  **Implementación:** Desarrollar la funcionalidad en la rama correspondiente.
3.  **Pruebas Locales:** Verificar el correcto funcionamiento localmente (`ng serve`, `ng test`, `ng e2e` si aplica).
4.  **Pull Request (PR):** Crear un PR hacia la rama principal para revisión de código.
5.  **Integración Continua (CI):** Automatizar la verificación de build y pruebas (si están configuradas) al crear/actualizar PRs.
6.  **Merge:** Una vez aprobado el PR, hacer merge a la rama principal.
7.  **Despliegue Continuo (CD):** El merge a la rama principal dispara automáticamente el proceso de build y despliegue a Firebase Hosting (configurado vía GitHub Actions).

### Integración Específica con Firebase

Esta sección detalla cómo los diferentes servicios de Firebase se configuran e integran en el proyecto.

*   **Cloud Firestore:**
    *   Se utiliza como la base de datos NoSQL principal para almacenar los datos de **productos**, **categorías** y potencialmente otros datos de la aplicación.
    *   La estructura de datos debe ser eficiente y escalable.
    *   **Seguridad:** Es crucial implementar reglas de seguridad robustas. Ver descripción de `firestore.rules` abajo.
    *   **Rendimiento:** Para consultas complejas, pueden ser necesarios índices compuestos. Ver nota sobre `firestore.indexes.json` abajo.
    *   **Backups:** Considerar estrategias de backup (manuales o automatizadas vía Google Cloud).

*   **Firebase Authentication:**
    *   Gestiona la identidad y sesión de los usuarios (login, registro, etc.).
    *   Configurado inicialmente con el proveedor "Correo electrónico/Contraseña".
    *   Integrado en Angular a través de los proveedores en `app.config.ts`.

*   **Firebase Hosting:**
    *   Sirve la aplicación Angular compilada.
    *   Configurado para funcionar como Single Page Application (SPA) mediante reglas de reescritura.
    *   Beneficios: SSL/TLS automático, CDN global.
    *   **Despliegue:** Automatizado mediante GitHub Actions (ver detalles abajo).

*   **Firebase Cloud Storage:** (Si se utiliza para imágenes u otros archivos)
    *   Almacenamiento de objetos escalable.
    *   **Seguridad:** Requiere configuración de reglas de seguridad. Ver descripción de `storage.rules` abajo.

*   **Archivos de Configuración Principales (Raíz del Proyecto):**
    *   `firebase.json`: Define la configuración para Firebase CLI, principalmente para Hosting (directorio público `dist/ng-ventas-maide/browser`, reglas de reescritura). También puede incluir configuraciones para desplegar reglas de Firestore y Storage si se desea. *Verificar que `public` coincida con `outputPath` en `angular.json`*.
    *   `.firebaserc`: Vincula el directorio local con el proyecto `ng-ventas-maide` en Firebase.
    *   `firestore.rules`: **(¡IMPORTANTE!)** Define las reglas de seguridad para **Cloud Firestore**. Especifica quién puede leer, escribir o modificar los datos. Es crucial configurar reglas adecuadas para proteger la base de datos. El archivo inicial puede contener reglas permisivas de prueba; deben ajustarse antes de producción o uso con datos reales.
    *   `storage.rules`: Define las reglas de seguridad para **Firebase Cloud Storage**. Especifica quién puede subir, descargar o eliminar archivos (ej. imágenes de productos). Similar a Firestore, las reglas iniciales deben revisarse y ajustarse por seguridad.
    *   `firestore.indexes.json`: Define los **índices compuestos** necesarios para optimizar el rendimiento de consultas complejas en Firestore (ej. filtrar por un campo y ordenar por otro diferente). Se inicia vacío y se rellena a medida que la aplicación requiere dichos índices.

*   **Despliegue Continuo (GitHub Actions):**
    *   **Activación:** El despliegue a Firebase Hosting se activa automáticamente cada vez que se realiza un `push` a la rama principal (`main`).
    *   **Workflow:** La lógica del despliegue está definida en el archivo `.github/workflows/firebase-hosting-merge.yml`. Este workflow se encarga de construir la aplicación y desplegarla a Hosting. *(Pasos: checkout, setup node, install deps, install ng-cli global, build, deploy).*
    *   **Autenticación Segura:** Usa un secreto de GitHub (`FIREBASE_SERVICE_ACCOUNT_NG_VENTAS_MAIDE`) que contiene una clave de cuenta de servicio de Google Cloud para autenticarse con Firebase. *(Obtener clave de GCloud Console IAM > Service Accounts, guardar en GitHub Settings > Secrets and variables > Actions)*.
    *   **Monitorización:** El progreso se ve en la pestaña `Actions` de GitHub.

## 🤝 Contribuciones

Si bien este es primordialmente un proyecto académico personal, las sugerencias constructivas, reportes de bugs o propuestas de mejora son bienvenidas. Por favor, utilicen la sección de "Issues" del repositorio de GitHub para iniciar la discusión.

## 📝 Notas Adicionales

*   El enfoque principal es educativo y demostrativo de tecnologías Angular modernas y Firebase.
*   La configuración inicial del proyecto omite la generación de archivos de test unitario (`.spec.ts`) para simplificar. Se pueden añadir posteriormente si es necesario.
*   La integración con Firebase se elige por su facilidad de uso y el ecosistema completo que ofrece para prototipado y desarrollo rápido (BaaS).

## 📞 Soporte y Contacto

Para preguntas técnicas, sugerencias o reporte de problemas, por favor, abrir un "Issue" en el repositorio oficial de GitHub del proyecto.

## 🚧 Estado Actual y Próximos Pasos (Abril 20, 2025)

Esta sección documenta el estado del proyecto al momento de la pausa actual en el desarrollo guiado.

**Objetivo Actual:** Implementar la visualización básica de una lista de productos leídos desde Cloud Firestore.

**Estado:**

1.  **Configuración Base:**
    *   Proyecto Angular 19 (`ng-ventas-maide`) inicializado.
    *   Firebase (Firestore, Authentication, Hosting) configurado en la consola.
    *   Configuración de Firebase integrada en Angular (`environment.ts`, `app.config.ts`).
    *   Despliegue Continuo (CD) a Firebase Hosting configurado mediante GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`, `firebase.json`, `.firebaserc`, Secreto de GitHub). El despliegue automático a `https://ng-ventas-maide.web.app/` está funcionando.
    *   Archivos de reglas (`firestore.rules`, `storage.rules`) y de índices (`firestore.indexes.json`) añadidos a la raíz del proyecto (con contenido inicial/de prueba).

2.  **Funcionalidad Catálogo (En Progreso):**
    *   **Modelo de Datos:** Interfaz `Product` definida y comentada en `src/app/features/products/models/product.model.ts`.
    *   **Datos de Prueba:** Se añadieron manualmente documentos de ejemplo a la colección `products` en Cloud Firestore a través de la consola web.
    *   **Servicio:** `ProductService` generado en `src/app/features/products/services/product.service.ts` y actualizado con el método `getProducts()` para leer la colección `products` usando `collectionData` de AngularFire (incluyendo `idField`).
    *   **Componente:** `ProductListComponent` (standalone) generado en `src/app/features/products/pages/product-list/` y actualizado (`.ts` y `.html`) con la lógica para inyectar `ProductService`, obtener el `Observable` de productos y mostrar una lista básica usando `async` pipe y `*ngFor`.

**Tareas Inmediatas Pendientes (Para Continuar):**

1.  **Configurar Enrutado:**
    *   Definir una ruta (ej: `/catalog` o `/products`) en `src/app/app.routes.ts` que cargue de forma diferida (lazy load) el `ProductListComponent` standalone.
2.  **Navegación:**
    *   Añadir un enlace temporal en `src/app/app.component.html` (o en un futuro componente de layout/header) para poder navegar a la nueva ruta del catálogo.
3.  **Verificación:**
    *   Ejecutar `ng serve` y verificar que al navegar a la nueva ruta, se muestre la lista de productos leídos desde Firestore (usando los datos de prueba añadidos manualmente).

**Siguientes Fases (Según Roadmap):**

*   Implementar funcionalidad CRUD completa para productos (crear, actualizar, eliminar desde la UI).
*   Adaptar e integrar módulos de autenticación y administración desde `ng-shape-up`.
*   Refinar diseño (responsive, Material/Tailwind).
*   Ajustar reglas de seguridad de Firestore/Storage.
