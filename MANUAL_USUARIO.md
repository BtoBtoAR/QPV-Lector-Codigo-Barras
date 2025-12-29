# Manual de Usuario - QPV Lector de Código de Barras

## Introducción

Esta aplicación móvil para Android permite gestionar el inventario de productos mediante el escaneo de códigos de barras. La aplicación utiliza la cámara del dispositivo para leer códigos de barras y mantiene una base de datos local de productos.

## Características Principales

### 1. Escaneo de Códigos de Barras
- La aplicación utiliza el componente `CameraView` de expo-camera
- Soporta múltiples formatos: EAN13, EAN8, UPC-A, UPC-E, Code39, Code128, QR
- Escaneo automático al detectar un código de barras
- Interfaz visual con marco de escaneo para facilitar la captura

### 2. Gestión de Productos Existentes
Cuando se escanea un código de barras de un producto ya registrado, la aplicación muestra:
- Fotografía del producto
- Código de barras
- Descripción del producto
- Unidad de medida
- Costo
- Precio de venta
- Campo editable para actualizar la cantidad de existencia

### 3. Registro de Nuevos Productos
Si el código de barras escaneado no existe en la base de datos, la aplicación permite:
- Tomar una fotografía del producto con la cámara
- Capturar la descripción del producto
- Especificar la unidad de medida (ej. Pieza, Kg, Litro, Caja)
- Ingresar el costo del producto
- Ingresar el precio de venta
- Registrar la cantidad inicial de existencia

## Flujo de Uso

### Primer Uso
1. Al abrir la aplicación por primera vez, se solicitarán permisos para:
   - Acceso a la cámara
   - Almacenamiento de fotos
2. Otorgue los permisos necesarios para el funcionamiento correcto

### Escanear un Producto
1. Apunte la cámara hacia el código de barras del producto
2. Mantenga el código dentro del marco de escaneo
3. La aplicación detectará automáticamente el código

### Actualizar Existencia (Producto Existente)
1. Después del escaneo, se mostrará la información del producto
2. En el campo "Cantidad Actual", ingrese el nuevo valor de existencia
3. Presione el botón "Actualizar Cantidad"
4. Aparecerá un mensaje de confirmación
5. Presione "Cancelar" para volver a la pantalla de escaneo

### Registrar Nuevo Producto
1. Después del escaneo de un código no registrado, aparecerá el formulario
2. Presione "Tomar Fotografía" para capturar una imagen del producto
3. Complete todos los campos requeridos:
   - **Descripción**: Nombre o descripción del producto
   - **Unidad de Medida**: La unidad en que se mide el producto
   - **Costo**: El costo de adquisición del producto
   - **Precio**: El precio de venta del producto
   - **Cantidad**: La cantidad inicial en inventario
4. Presione "Guardar Producto"
5. El producto quedará registrado y podrá ser consultado en futuros escaneos

## Tecnología

### Frontend
- **React Native**: Framework multiplataforma
- **TypeScript**: Tipado estático para mayor confiabilidad
- **Expo**: Plataforma de desarrollo rápido

### Componentes Principales
- **expo-camera (CameraView)**: Para escaneo de códigos de barras
- **expo-image-picker**: Para captura de fotografías
- **AsyncStorage**: Base de datos local del dispositivo

### Almacenamiento de Datos
- Los datos se almacenan localmente en el dispositivo usando AsyncStorage
- Formato JSON para fácil manipulación
- Indexado por código de barras para búsqueda rápida

## Estructura de Datos

Cada producto almacena la siguiente información:

```typescript
{
  barcode: string;        // Código de barras único
  photoUri: string;       // Ruta de la fotografía
  description: string;    // Descripción del producto
  unitOfMeasure: string; // Unidad de medida
  cost: number;          // Costo de adquisición
  price: number;         // Precio de venta
  quantity: number;      // Cantidad en existencia
}
```

## Solución de Problemas

### La cámara no se activa
- Verifique que ha otorgado permisos de cámara a la aplicación
- Vaya a Configuración > Aplicaciones > QPV Lector de Código de Barras > Permisos
- Active el permiso de cámara

### No se pueden guardar las fotos
- Verifique que ha otorgado permisos de almacenamiento
- Asegúrese de tener espacio suficiente en el dispositivo

### El código de barras no se escanea
- Asegúrese de tener buena iluminación
- Mantenga el código dentro del marco de escaneo
- Limpie la lente de la cámara si es necesario
- Verifique que el código de barras esté en buen estado (no dañado o borroso)

### La aplicación se cierra inesperadamente
- Libere memoria cerrando otras aplicaciones
- Reinicie la aplicación
- Si persiste, reinstale la aplicación

## Limitaciones

- La aplicación solo funciona en dispositivos Android
- Requiere conexión a internet solo para la instalación inicial
- El almacenamiento es local, no sincroniza con la nube
- La capacidad de almacenamiento depende del espacio disponible en el dispositivo

## Futuras Mejoras Potenciales

- Exportación de datos a CSV o Excel
- Sincronización con base de datos en la nube
- Generación de reportes de inventario
- Búsqueda de productos por nombre
- Historial de cambios de existencia
- Alertas de stock bajo
- Soporte para múltiples usuarios

## Soporte

Para reportar problemas o sugerencias, contacte al equipo de desarrollo.
