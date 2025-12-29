# Documentación Técnica - QPV Lector de Código de Barras

## Arquitectura de la Aplicación

### Stack Tecnológico

- **React Native**: v0.76.9
- **Expo**: v52.0.0
- **TypeScript**: v5.3.3
- **expo-camera**: v16.0.0
- **expo-image-picker**: v16.0.0
- **@react-native-async-storage/async-storage**: v1.23.1

### Estructura del Proyecto

```
QPV-Lector-Codigo-Barras/
├── App.tsx                 # Componente principal con lógica de navegación
├── index.js                # Punto de entrada de la aplicación
├── types/
│   └── Product.ts         # Definición de interfaces TypeScript
├── utils/
│   └── database.ts        # Funciones de base de datos
├── assets/                # Recursos estáticos (iconos, splash screen)
├── app.json              # Configuración de Expo
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
└── babel.config.js       # Configuración de Babel
```

## Componentes Principales

### App.tsx

El componente principal maneja tres pantallas:

1. **Scanner**: Pantalla de escaneo de códigos de barras
2. **Product Details**: Muestra información de producto existente
3. **Add Product**: Formulario para agregar nuevo producto

#### Estados Principales

```typescript
type Screen = 'scanner' | 'product-details' | 'add-product';

const [currentScreen, setCurrentScreen] = useState<Screen>('scanner');
const [scannedBarcode, setScannedBarcode] = useState<string>('');
const [product, setProduct] = useState<Product | null>(null);
const [isScanning, setIsScanning] = useState(true);
```

#### Flujo de Navegación

```
Scanner --[barcode scanned]--> Check Database
                                      |
                         +------------+------------+
                         |                         |
                   [exists]                  [not exists]
                         |                         |
                 Product Details              Add Product
                         |                         |
                         +------------+------------+
                                      |
                         [save/cancel] --> Scanner
```

### Funciones Principales

#### handleBarcodeScanned

Maneja el evento de escaneo de código de barras:

```typescript
const handleBarcodeScanned = async ({ data }: { data: string }) => {
  if (!isScanning) return;
  
  setIsScanning(false);
  setScannedBarcode(data);
  
  try {
    const foundProduct = await getProduct(data);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(foundProduct.quantity.toString());
      setCurrentScreen('product-details');
    } else {
      setCurrentScreen('add-product');
    }
  } catch (error) {
    Alert.alert('Error', 'Error al buscar el producto');
    setIsScanning(true);
  }
};
```

#### handleSaveProduct

Guarda un nuevo producto en la base de datos:

```typescript
const handleSaveProduct = async () => {
  // Validación de campos
  if (!photoUri || !description || !unitOfMeasure || !cost || !price || !quantity) {
    Alert.alert('Error', 'Por favor complete todos los campos');
    return;
  }

  try {
    const newProduct: Product = {
      barcode: scannedBarcode,
      photoUri,
      description,
      unitOfMeasure,
      cost: parseFloat(cost),
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    };

    await saveProduct(newProduct);
    Alert.alert('Éxito', 'Producto guardado correctamente');
    resetForm();
    setCurrentScreen('scanner');
    setIsScanning(true);
  } catch (error) {
    Alert.alert('Error', 'Error al guardar el producto');
  }
};
```

## Capa de Datos

### database.ts

Proporciona funciones para interactuar con AsyncStorage:

#### saveProduct

```typescript
export const saveProduct = async (product: Product): Promise<void> => {
  const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
  const products: { [barcode: string]: Product } = productsJson 
    ? JSON.parse(productsJson) 
    : {};
  
  products[product.barcode] = product;
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};
```

#### getProduct

```typescript
export const getProduct = async (barcode: string): Promise<Product | null> => {
  const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
  if (!productsJson) return null;
  
  const products: { [barcode: string]: Product } = JSON.parse(productsJson);
  return products[barcode] || null;
};
```

#### updateProductQuantity

```typescript
export const updateProductQuantity = async (
  barcode: string, 
  quantity: number
): Promise<void> => {
  const product = await getProduct(barcode);
  if (!product) {
    throw new Error('Product not found');
  }
  
  product.quantity = quantity;
  await saveProduct(product);
};
```

## Configuración de Expo

### app.json

Configuración específica para Android:

```json
{
  "android": {
    "package": "com.btobtcar.qpvlectorcodigobarras",
    "permissions": [
      "CAMERA",
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE"
    ]
  },
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Permitir que $(PRODUCT_NAME) acceda a la cámara"
      }
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "La aplicación necesita acceso a tus fotos"
      }
    ]
  ]
}
```

## Estilos

Los estilos utilizan StyleSheet de React Native:

### Diseño Responsive

Los componentes se adaptan al tamaño de la pantalla usando:
- Flexbox para layouts
- ScrollView para contenido largo
- Dimensiones relativas

### Paleta de Colores

- **Primary**: #007AFF (azul iOS)
- **Danger**: #FF3B30 (rojo)
- **Success**: #00ff00 (verde para marco de escaneo)
- **Background**: #f5f5f5 (gris claro)
- **Text**: #333 (gris oscuro)

## Permisos de Android

### Configuración en AndroidManifest.xml

Los plugins de Expo automáticamente agregan:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### Solicitud en Tiempo de Ejecución

```typescript
const [permission, requestPermission] = useCameraPermissions();

useEffect(() => {
  if (permission && !permission.granted) {
    requestPermission();
  }
}, [permission]);
```

## Desarrollo

### Instalación de Dependencias

```bash
npm install
```

### Ejecutar en Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en dispositivo físico
# Escanear el QR code con Expo Go app
```

### Compilar para Producción

```bash
# Generar APK
npx eas build --platform android --profile preview

# Generar AAB para Google Play
npx eas build --platform android --profile production
```

### Debugging

```bash
# Logs de la aplicación
npx react-native log-android

# Abrir React Native Debugger
# Presionar Cmd+D (o Ctrl+D en Windows/Linux) en el emulador
```

## Testing

### Unit Tests

Para agregar tests unitarios, instalar:

```bash
npm install --save-dev jest @testing-library/react-native
```

Ejemplo de test para database.ts:

```typescript
import { saveProduct, getProduct } from './utils/database';

describe('Database Functions', () => {
  it('should save and retrieve a product', async () => {
    const product = {
      barcode: '1234567890',
      photoUri: 'file://...',
      description: 'Test Product',
      unitOfMeasure: 'Piece',
      cost: 10.0,
      price: 15.0,
      quantity: 100,
    };

    await saveProduct(product);
    const retrieved = await getProduct('1234567890');
    
    expect(retrieved).toEqual(product);
  });
});
```

## Optimizaciones

### Performance

1. **Lazy Loading**: Cargar imágenes bajo demanda
2. **Memoization**: Usar React.memo para componentes que no cambian frecuentemente
3. **Debouncing**: Evitar escaneos múltiples con el flag `isScanning`

### Manejo de Memoria

- Las imágenes se comprimen a calidad 0.8
- AsyncStorage tiene límite de ~6MB (puede variar por dispositivo)
- Considerar implementar paginación para muchos productos

## Seguridad

### Datos Sensibles

- No se almacenan credenciales en la aplicación
- AsyncStorage no está encriptado por defecto
- Para datos sensibles, considerar usar expo-secure-store

### Validación de Entrada

- Validar que campos numéricos sean números válidos
- Sanitizar strings antes de guardar
- Verificar que las fotos existan antes de mostrarlas

## Mantenimiento

### Actualizar Dependencias

```bash
# Verificar versiones compatibles
npx expo-doctor

# Actualizar a versiones recomendadas
npx expo install --check
```

### Logs y Monitoreo

Implementar logging para producción:

```typescript
const logError = (error: Error, context: string) => {
  console.error(`[${context}]`, error);
  // Enviar a servicio de monitoreo como Sentry
};
```

## Limitaciones Conocidas

1. AsyncStorage tiene límite de almacenamiento (~6MB)
2. Las fotos se almacenan en el sistema de archivos, no en AsyncStorage
3. No hay sincronización entre dispositivos
4. La base de datos se perderá si se desinstala la app

## Futuras Mejoras Técnicas

1. **Migrar a SQLite**: Para mejor rendimiento con muchos productos
2. **Implementar Redux/MobX**: Para gestión de estado global
3. **Agregar Tests**: Unit tests y E2E tests
4. **Optimizar imágenes**: Comprimir y redimensionar automáticamente
5. **Offline-first**: Sincronización cuando hay conexión
6. **Background sync**: Actualizar datos en segundo plano
