# 🗺️ Configuración de Mapas en Móvil (Expo)

## ⚠️ Problema con Expo Go

`@rnmapbox/maps` **NO funciona en Expo Go** porque requiere módulos nativos que no vienen preinstalados. Necesitas crear un **Development Build** personalizado.

## 🚀 Solución: Crear Development Build

### Opción A: Build en la Nube (EAS Build - Recomendado)

#### 1. Inicializar EAS en el proyecto

```bash
cd MiAppExpo
eas login
# Ingresa tus credenciales de Expo

eas build:configure
# Esto creará el archivo eas.json
```

#### 2. Crear el build para desarrollo

**Para Android (más rápido):**

```bash
eas build --profile development --platform android
```

**Para iOS (requiere cuenta de Apple Developer - $99/año):**

```bash
eas build --profile development --platform ios
```

#### 3. Instalar el build en tu dispositivo

Una vez que termine el build (~10-20 minutos):

- Recibirás un link de descarga
- Abre el link en tu celular
- Instala el APK (Android) o perfil (iOS)

#### 4. Ejecutar el servidor de desarrollo

```bash
npx expo start --dev-client
```

Escanea el QR con tu app personalizada (NO Expo Go).

---

### Opción B: Build Local (Más Rápido pero Requiere Setup)

#### Para Android (Requiere Android Studio)

1. **Instalar Android Studio**

   - Descargar de: https://developer.android.com/studio
   - Instalar Android SDK, Platform Tools, y Build Tools

2. **Configurar variables de entorno**

   ```bash
   # Agregar a PATH:
   ANDROID_HOME=C:\Users\TuUsuario\AppData\Local\Android\Sdk
   ```

3. **Pre-build con Expo**

   ```bash
   npx expo prebuild --platform android
   ```

4. **Ejecutar en emulador o dispositivo**
   ```bash
   npx expo run:android
   ```

#### Para iOS (Solo en Mac)

1. **Instalar Xcode** (desde App Store)

2. **Instalar CocoaPods**

   ```bash
   sudo gem install cocoapods
   ```

3. **Pre-build con Expo**

   ```bash
   npx expo prebuild --platform ios
   cd ios
   pod install
   cd ..
   ```

4. **Ejecutar en simulador o dispositivo**
   ```bash
   npx expo run:ios
   ```

---

## 🌐 Alternativa: Usar Solo Web

Si no quieres lidiar con builds nativos, puedes:

1. **Deshabilitar mapas en móvil**
2. **Usar solo la versión web** (funciona perfecto en navegadores)
3. **Mostrar mensaje en móvil**: "Los mapas solo están disponibles en la versión web"

### Implementación de la alternativa:

Edita `src/screens/ver_mapa.js`:

```javascript
import { Platform } from "react-native";

export default function VerMapa() {
  if (Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          📱 Los mapas interactivos solo están disponibles en la versión web.
          {"\n\n"}
          Por favor, accede desde un navegador para usar esta funcionalidad.
        </Text>
      </View>
    );
  }

  // Resto del código del mapa...
}
```

---

## 🔑 Token de Mapbox (Opcional)

Si decides usar Mapbox en lugar de OpenStreetMap:

1. **Crear cuenta gratuita**: https://account.mapbox.com/
2. **Copiar tu Public Token**
3. **Agregar a `.env`**:
   ```env
   MAPBOX_DOWNLOAD_TOKEN=pk.eyJ1...
   ```
4. **Actualizar en código**:
   ```javascript
   // NativeMapView.js
   Mapbox.setAccessToken(process.env.MAPBOX_DOWNLOAD_TOKEN);
   ```

---

## 📊 Comparación de Opciones

| Opción                  | Tiempo Setup | Complejidad | Funciona en Móvil | Costo                 |
| ----------------------- | ------------ | ----------- | ----------------- | --------------------- |
| **EAS Build Cloud**     | 1 hora       | Media       | ✅ Sí             | Gratis (2 builds/mes) |
| **Build Local Android** | 2-3 horas    | Alta        | ✅ Sí             | Gratis                |
| **Build Local iOS**     | 2-3 horas    | Alta        | ✅ Sí             | $99/año (Apple Dev)   |
| **Solo Web**            | 5 minutos    | Baja        | ❌ No             | Gratis                |

---

## 🎯 Recomendación

Para tu caso (desarrollo y testing):

1. **Corto plazo**: Usa **solo web** (ya funciona perfectamente)
2. **Mediano plazo**: Crea un **EAS Build** si necesitas probar en móvil
3. **Producción**: Necesitarás builds nativos de todos modos

---

## 🧪 Verificar que Web Funciona

```bash
npx expo start
# Presiona 'w' para abrir en navegador
# Navega a "Mapa Interactivo"
# Debería mostrar Temuco perfectamente
```

---

## ❓ Troubleshooting

### Error: "Module not found @rnmapbox/maps"

- Esto es normal en web, el wrapper lo maneja automáticamente

### Error: "turboModuleProxy is not a function"

- Significa que estás usando Expo Go (no compatible)
- Usa la alternativa "Solo Web" o crea un Development Build

### Mapa en blanco

- Verifica que las coordenadas sean correctas
- Abre la consola del navegador (F12) para ver errores
- Verifica conexión a internet (tiles se descargan online)

---

## 📞 Soporte

- Documentación @rnmapbox/maps: https://github.com/rnmapbox/maps
- Expo Development Builds: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build: https://docs.expo.dev/build/introduction/
