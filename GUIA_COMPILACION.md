# Guía de Compilación y Despliegue

## Prerrequisitos

- Node.js 16 o superior instalado
- npm o yarn
- Cuenta de Expo (para builds en la nube)
- Android Studio (para builds locales)

## Opción 1: Ejecutar en Desarrollo

### Usando Expo Go (Recomendado para pruebas rápidas)

1. Instalar Expo Go en tu dispositivo Android desde Google Play Store

2. En tu computadora, ejecutar:
```bash
cd QPV-Lector-Codigo-Barras
npm install
npm start
```

3. Escanear el QR code que aparece en la terminal con la app Expo Go

4. La aplicación se cargará en tu dispositivo

**Nota**: Esta opción requiere que tu computadora y dispositivo estén en la misma red WiFi.

### Usando Emulador Android

1. Instalar Android Studio y configurar un emulador Android

2. Iniciar el emulador

3. Ejecutar:
```bash
npm install
npm run android
```

## Opción 2: Build de Desarrollo (APK)

### Usando EAS Build (Recomendado)

1. Instalar EAS CLI:
```bash
npm install -g eas-cli
```

2. Iniciar sesión en Expo:
```bash
eas login
```

3. Configurar el proyecto:
```bash
eas build:configure
```

4. Crear build de desarrollo:
```bash
eas build --platform android --profile development
```

5. Una vez completado, descargar el APK desde el enlace proporcionado

6. Instalar el APK en tu dispositivo Android

### Usando Build Local

1. Instalar dependencias:
```bash
npm install -g expo-cli
```

2. Generar el proyecto Android:
```bash
npx expo prebuild
```

3. Abrir el proyecto en Android Studio:
```bash
cd android
./gradlew assembleDebug
```

4. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Opción 3: Build de Producción (Para Google Play Store)

### Preparación

1. Crear una cuenta de desarrollador de Google Play ($25 único pago)

2. Generar una keystore para firmar la app:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

3. Crear archivo `eas.json` en la raíz del proyecto:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

### Build de Producción

1. Ejecutar build de producción:
```bash
eas build --platform android --profile production
```

2. EAS te pedirá que generes credenciales (keystore)
   - Puedes dejar que EAS las genere automáticamente
   - O puedes subir tu propia keystore

3. Esperar a que termine el build (10-20 minutos)

4. Descargar el AAB (Android App Bundle)

### Publicar en Google Play Store

1. Ir a [Google Play Console](https://play.google.com/console)

2. Crear una nueva aplicación

3. Completar la información requerida:
   - Título: QPV Lector de Código de Barras
   - Descripción corta y completa
   - Capturas de pantalla (mínimo 2)
   - Icono de la aplicación
   - Banner de características

4. Subir el AAB en la sección "Producción" o "Prueba interna"

5. Completar el cuestionario de contenido

6. Enviar para revisión

## Pruebas Antes de Publicar

### Checklist de Pruebas

- [ ] La cámara se abre correctamente
- [ ] Se pueden escanear códigos de barras
- [ ] Se pueden guardar nuevos productos
- [ ] Se pueden ver productos existentes
- [ ] Se puede actualizar la cantidad
- [ ] Las fotos se guardan correctamente
- [ ] Los permisos se solicitan apropiadamente
- [ ] La navegación funciona correctamente
- [ ] No hay crashes al usar la app
- [ ] La app funciona sin conexión a internet

### Dispositivos de Prueba Recomendados

Probar en al menos:
- 1 dispositivo con Android 10 o inferior
- 1 dispositivo con Android 11+
- 1 dispositivo con pantalla pequeña (< 5 pulgadas)
- 1 dispositivo con pantalla grande (> 6 pulgadas)

## Actualización de la App

### Para Desarrollo

```bash
# Hacer cambios en el código
# Luego:
npm start
# O para Android directo:
npm run android
```

### Para Producción

1. Actualizar el número de versión en `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

2. Generar nuevo build:
```bash
eas build --platform android --profile production
```

3. Subir nuevo AAB a Google Play Console

4. Publicar actualización

## Solución de Problemas Comunes

### Error: "SDK location not found"

Configurar la variable de entorno ANDROID_HOME:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### Error: "Unable to load script"

1. Limpiar caché:
```bash
npx expo start --clear
```

2. Reinstalar dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de Permisos en Android

Asegurarse de que `app.json` tiene los permisos correctos en la sección `android.permissions`.

### Build Falla en EAS

1. Verificar que todas las dependencias sean compatibles:
```bash
npx expo-doctor
```

2. Revisar los logs de error en el panel de EAS

## Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [React Native Docs](https://reactnative.dev/)

## Contacto y Soporte

Para problemas o preguntas sobre el código, revisar:
- `DOCUMENTACION_TECNICA.md` para detalles técnicos
- `MANUAL_USUARIO.md` para guía de uso
- `README.md` para información general
