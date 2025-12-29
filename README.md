# QPV-Lector-Codigo-Barras

Aplicación móvil para Android que permite escanear códigos de barras de productos, buscarlos en una base de datos local y gestionar su información.

## Características

- **Escaneo de Códigos de Barras**: Utiliza la cámara del dispositivo para escanear códigos de barras (EAN13, EAN8, UPC-A, UPC-E, Code39, Code128, QR).
- **Base de Datos Local**: Almacena información de productos usando AsyncStorage.
- **Gestión de Productos**:
  - Si el producto existe: Muestra fotografía, código de barras, descripción, unidad de medida, costo, precio y permite actualizar la cantidad de existencia.
  - Si el producto no existe: Permite tomar una fotografía y capturar todos los datos del producto.

## Requisitos

- Node.js 16 o superior
- npm o yarn
- Android Studio (para pruebas en emulador Android)
- Expo Go (para pruebas en dispositivo físico)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npm start
```

3. Para ejecutar en Android:
```bash
npm run android
```

## Estructura del Proyecto

```
QPV-Lector-Codigo-Barras/
├── App.tsx                 # Componente principal de la aplicación
├── types/
│   └── Product.ts         # Definición de tipos TypeScript
├── utils/
│   └── database.ts        # Utilidades para gestión de base de datos
├── assets/                # Recursos de la aplicación
├── app.json              # Configuración de Expo
├── package.json          # Dependencias del proyecto
└── tsconfig.json         # Configuración de TypeScript
```

## Uso

1. **Escanear Producto**:
   - La aplicación inicia en la pantalla de escaneo
   - Apunte la cámara al código de barras del producto
   - La aplicación escaneará automáticamente

2. **Producto Existente**:
   - Se mostrará la información del producto
   - Puede actualizar la cantidad de existencia actual
   - Presione "Actualizar Cantidad" para guardar

3. **Producto Nuevo**:
   - Presione "Tomar Fotografía" para capturar una imagen del producto
   - Complete todos los campos:
     - Descripción
     - Unidad de medida (ej. Pieza, Kg, Litro)
     - Costo
     - Precio
     - Cantidad
   - Presione "Guardar Producto"

## Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma para desarrollo rápido de aplicaciones
- **expo-camera**: Componente CameraView para escaneo de códigos de barras
- **expo-image-picker**: Para captura de fotografías
- **AsyncStorage**: Almacenamiento local de datos
- **TypeScript**: Para tipado estático

## Permisos de Android

La aplicación requiere los siguientes permisos:
- `CAMERA`: Para escanear códigos de barras y tomar fotografías
- `WRITE_EXTERNAL_STORAGE`: Para guardar fotografías
- `READ_EXTERNAL_STORAGE`: Para leer fotografías

## Licencia

Este proyecto es de código abierto.
