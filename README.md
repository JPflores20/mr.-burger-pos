# Mr. Burger - Punto de Venta (POS)

**URL del Proyecto:** [https://mrburguer-c5f7d.web.app](https://mrburguer-c5f7d.web.app)

Sistema de Punto de Venta moderno y eficiente diseñado específicamente para **Mr. Burger**. Esta aplicación facilita la gestión de pedidos, la coordinación entre caja y cocina, y el seguimiento administrativo.

## 🚀 Características Principales

- **Terminal de Ventas (POS):** Interfaz intuitiva para capturar pedidos rápidamente, personalizar hamburguesas y procesar pagos.
- **Vista de Cocina:** Monitor en tiempo real para que el personal de cocina gestione y marque los pedidos como listos.
- **Panel de Administración:** Gestión de inventarios, reportes de ventas y configuración de productos.
- **Sincronización en Tiempo Real:** Gracias a Firebase, todos los cambios se reflejan instantáneamente en todos los dispositivos.
- **Modo Offline:** Persistencia de datos local para continuar trabajando incluso con interrupciones de internet.

## 🛠️ Tecnologías Usadas

- **Frontend:** React + Vite + TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Backend/Base de Datos:** Firebase (Firestore & Auth)
- **Estado Global:** React Context API
- **Iconografía:** Lucide React

## 📦 Instalación y Desarrollo

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**

   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd mr.-burger-pos
   ```

2. **Instalar dependencias:**

   ```sh
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```sh
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

- `/src/components`: Componentes reutilizables de la interfaz.
- `/src/context`: Proveedores de contexto para el estado global (Pedidos, Autenticación, Carrito).
- `/src/pages`: Vistas principales (Login, POS, Cocina, Admin).
- `/src/lib`: Configuraciones de Firebase y utilidades generales.
- `/src/data`: Definiciones de menús y categorías.

## 📄 Licencia

Este proyecto es privado para el uso exclusivo de Mr. Burger.
