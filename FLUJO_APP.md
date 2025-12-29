# Flujo de la Aplicación

## Diagrama de Navegación

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         INICIO - PANTALLA DE ESCANEO           │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │                                       │    │
│  │       🎥 VISTA DE CÁMARA              │    │
│  │                                       │    │
│  │         ┌───────────┐                │    │
│  │         │     🔲    │  ← Marco       │    │
│  │         │           │    de          │    │
│  │         └───────────┘    escaneo     │    │
│  │                                       │    │
│  │    "Escanee el código de barras"     │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Código escaneado
                  ▼
         ┌────────────────┐
         │ Buscar en BD   │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
    ¿Existe?          ¿No existe?
         │                 │
         ▼                 ▼
┌────────────────┐  ┌──────────────────┐
│  PRODUCTO      │  │  AGREGAR         │
│  ENCONTRADO    │  │  PRODUCTO        │
└────────────────┘  └──────────────────┘
```

## Pantalla 1: Scanner (Escaneo)

```
╔═══════════════════════════════════════╗
║  QPV Lector de Código de Barras      ║
╠═══════════════════════════════════════╣
║                                       ║
║     ┌─────────────────────┐          ║
║     │                     │          ║
║     │                     │          ║
║     │   VISTA DE CÁMARA   │          ║
║     │                     │          ║
║     │      ┌───────┐      │          ║
║     │      │ ⌈   ⌉ │      │          ║
║     │      │       │      │          ║
║     │      │ ⌊   ⌋ │      │          ║
║     │      └───────┘      │          ║
║     │   [Marco verde]     │          ║
║     │                     │          ║
║     └─────────────────────┘          ║
║                                       ║
║  Escanee el código de barras del     ║
║           producto                    ║
║                                       ║
╚═══════════════════════════════════════╝
```

## Pantalla 2: Producto Encontrado

```
╔═══════════════════════════════════════╗
║  Detalles del Producto                ║
╠═══════════════════════════════════════╣
║                                       ║
║      ┌─────────────────┐              ║
║      │                 │              ║
║      │  📸 FOTO DEL   │              ║
║      │    PRODUCTO     │              ║
║      │                 │              ║
║      └─────────────────┘              ║
║                                       ║
║  Código de Barras:                    ║
║  └─ 7501234567890                     ║
║                                       ║
║  Descripción:                         ║
║  └─ Coca Cola 600ml                   ║
║                                       ║
║  Unidad de Medida:                    ║
║  └─ Pieza                             ║
║                                       ║
║  Costo:                               ║
║  └─ $10.00                            ║
║                                       ║
║  Precio:                              ║
║  └─ $15.00                            ║
║                                       ║
║  Cantidad Actual:                     ║
║  [____________100____________]        ║
║                                       ║
║  ┌─────────────────────────┐          ║
║  │  Actualizar Cantidad    │          ║
║  └─────────────────────────┘          ║
║                                       ║
║  ┌─────────────────────────┐          ║
║  │      Cancelar           │          ║
║  └─────────────────────────┘          ║
║                                       ║
╚═══════════════════════════════════════╝
```

## Pantalla 3: Agregar Nuevo Producto

```
╔═══════════════════════════════════════╗
║  Agregar Nuevo Producto               ║
╠═══════════════════════════════════════╣
║                                       ║
║  Código de Barras: 7501234567890      ║
║                                       ║
║      ┌─────────────────┐              ║
║      │                 │              ║
║      │  📷 Tomar       │              ║
║      │   Fotografía    │              ║
║      │                 │              ║
║      └─────────────────┘              ║
║                                       ║
║  Descripción:                         ║
║  [_____________________________]      ║
║                                       ║
║  Unidad de Medida:                    ║
║  [_____________________________]      ║
║                                       ║
║  Costo:                               ║
║  [_____________________________]      ║
║                                       ║
║  Precio:                              ║
║  [_____________________________]      ║
║                                       ║
║  Cantidad:                            ║
║  [_____________________________]      ║
║                                       ║
║  ┌─────────────────────────┐          ║
║  │   Guardar Producto      │          ║
║  └─────────────────────────┘          ║
║                                       ║
║  ┌─────────────────────────┐          ║
║  │      Cancelar           │          ║
║  └─────────────────────────┘          ║
║                                       ║
╚═══════════════════════════════════════╝
```

## Estados de la Aplicación

### Estado 1: Inicio
- **Pantalla**: Scanner
- **Acción**: Esperando escaneo de código de barras
- **Permisos**: Solicita acceso a cámara si no se ha otorgado

### Estado 2: Código Escaneado - Producto Existe
- **Pantalla**: Detalles del Producto
- **Datos Mostrados**:
  - Fotografía del producto
  - Código de barras
  - Descripción
  - Unidad de medida
  - Costo
  - Precio
  - Campo editable de cantidad
- **Acciones Disponibles**:
  - Actualizar cantidad → Guarda y vuelve a Scanner
  - Cancelar → Vuelve a Scanner

### Estado 3: Código Escaneado - Producto No Existe
- **Pantalla**: Agregar Producto
- **Datos Requeridos**:
  - Fotografía (mediante cámara)
  - Descripción (texto)
  - Unidad de medida (texto)
  - Costo (número)
  - Precio (número)
  - Cantidad (número)
- **Validaciones**:
  - Todos los campos son obligatorios
  - Costo, precio y cantidad deben ser números válidos ≥ 0
  - Debe haber una fotografía
- **Acciones Disponibles**:
  - Guardar Producto → Guarda en BD y vuelve a Scanner
  - Cancelar → Vuelve a Scanner

## Tipos de Códigos de Barras Soportados

1. **EAN-13**: 13 dígitos (más común en productos retail)
   - Ejemplo: 7501234567890

2. **EAN-8**: 8 dígitos (productos pequeños)
   - Ejemplo: 12345678

3. **UPC-A**: 12 dígitos (común en USA)
   - Ejemplo: 012345678905

4. **UPC-E**: 6-8 dígitos (versión compacta)
   - Ejemplo: 0123456

5. **Code 39**: Alfanumérico
   - Ejemplo: *CODE39*

6. **Code 128**: Alfanumérico de alta densidad
   - Ejemplo: ABC123456

7. **QR Code**: Código bidimensional
   - Puede contener URLs, texto, etc.

## Flujo de Datos

```
Usuario
  │
  ├─► Escanea código
  │        │
  │        ▼
  │   Buscar en AsyncStorage
  │        │
  │        ├─► Encontrado
  │        │     │
  │        │     ├─► Mostrar datos
  │        │     ├─► Editar cantidad
  │        │     └─► Actualizar en BD
  │        │
  │        └─► No encontrado
  │              │
  │              ├─► Tomar foto
  │              ├─► Ingresar datos
  │              └─► Guardar en BD
  │
  └─► Volver a escanear
```

## Almacenamiento de Datos

### Estructura en AsyncStorage

```json
{
  "@products_database": {
    "7501234567890": {
      "barcode": "7501234567890",
      "photoUri": "file:///data/user/0/.../image.jpg",
      "description": "Coca Cola 600ml",
      "unitOfMeasure": "Pieza",
      "cost": 10.00,
      "price": 15.00,
      "quantity": 100
    },
    "7501234567891": {
      "barcode": "7501234567891",
      "photoUri": "file:///data/user/0/.../image2.jpg",
      "description": "Pepsi 600ml",
      "unitOfMeasure": "Pieza",
      "cost": 9.50,
      "price": 14.50,
      "quantity": 75
    }
  }
}
```

## Interacciones del Usuario

### Gestos y Controles

1. **En Scanner**:
   - Apuntar cámara al código
   - Esperar detección automática

2. **En Producto Existente**:
   - Tocar campo de cantidad
   - Escribir nuevo valor
   - Tocar "Actualizar Cantidad"
   - O tocar "Cancelar"

3. **En Agregar Producto**:
   - Tocar "Tomar Fotografía"
   - Capturar imagen
   - Tocar campos de texto
   - Ingresar valores
   - Tocar "Guardar Producto"
   - O tocar "Cancelar"

## Manejo de Errores

### Errores del Usuario
- ❌ Campos vacíos → "Complete todos los campos"
- ❌ Números inválidos → "El [campo] debe ser un número válido"
- ❌ Valores negativos → "El [campo] debe ser mayor o igual a 0"

### Errores del Sistema
- ❌ Error de BD → "Error al [guardar/buscar] el producto"
- ❌ Permisos denegados → "Necesitamos permiso para usar la cámara"

### Confirmaciones
- ✅ Producto guardado → "Producto guardado correctamente"
- ✅ Cantidad actualizada → "Cantidad actualizada correctamente"
