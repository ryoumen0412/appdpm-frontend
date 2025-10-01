/**
 * MobileMapView - Implementación de Mapa para iOS/Android usando WebView
 *
 * Usa react-native-webview para renderizar un mapa HTML con MapLibre GL
 * dentro de la app móvil. Compatible con Expo Go.
 *
 * Características:
 * - No requiere módulos nativos (funciona en Expo Go)
 * - Usa MapLibre GL en el WebView
 * - Comunicación bidireccional con JavaScript
 * - Geolocalización integrada
 */

import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function MobileMapView({ style }) {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Obtener ubicación cuando el mapa esté listo
    if (mapReady) {
      getUserLocation();
    }
  }, [mapReady]);

  // Función para obtener ubicación usando expo-location
  const getUserLocation = async () => {
    try {
      // Solicitar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso de Ubicación",
          "Para ver tu ubicación en el mapa, habilita los permisos de ubicación.",
          [{ text: "OK" }]
        );
        return;
      }

      console.log("[MobileMapView] Obteniendo ubicación con alta precisión...");

      // Obtener ubicación con máxima precisión
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, // Máxima precisión (GPS + sensores)
        maximumAge: 0, // No usar caché, siempre nueva ubicación
        timeout: 15000, // 15 segundos de timeout
      });

      const {
        longitude,
        latitude,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        speed,
      } = location.coords;

      console.log("[MobileMapView] === UBICACIÓN OBTENIDA ===");
      console.log("Latitud:", latitude);
      console.log("Longitud:", longitude);
      console.log("Precisión:", accuracy, "metros");
      console.log("Altitud:", altitude, "metros");
      console.log("Precisión Altitud:", altitudeAccuracy);
      console.log("Dirección:", heading, "grados");
      console.log("Velocidad:", speed, "m/s");
      console.log("============================");

      // Advertir si la precisión es baja
      if (accuracy && accuracy > 50) {
        console.warn("[MobileMapView] ⚠️ Precisión baja:", accuracy, "metros");
        Alert.alert(
          "Precisión Baja",
          `La ubicación tiene una precisión de ±${Math.round(
            accuracy
          )}m.\n\nPara mejor precisión:\n• Asegúrate de estar al aire libre\n• Verifica que el GPS esté habilitado\n• Espera unos segundos para que el GPS se estabilice`,
          [{ text: "OK" }]
        );
      } else {
        console.log("[MobileMapView] ✅ Buena precisión:", accuracy, "metros");
      }

      // Enviar ubicación al WebView
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          updateUserLocation(${longitude}, ${latitude}, ${accuracy || 50});
          true;
        `);
      }
    } catch (error) {
      console.error("[MobileMapView] Error al obtener ubicación:", error);

      let errorMessage = "No se pudo obtener la ubicación";

      if (error.code === "E_LOCATION_SERVICES_DISABLED") {
        errorMessage =
          "Los servicios de ubicación están deshabilitados. Habilítalos en la configuración del dispositivo.";
      } else if (error.code === "E_LOCATION_TIMEOUT") {
        errorMessage =
          "Tiempo de espera agotado. Intenta nuevamente al aire libre.";
      } else if (error.code === "E_LOCATION_UNAVAILABLE") {
        errorMessage =
          "Ubicación no disponible. Verifica que el GPS esté habilitado.";
      }

      Alert.alert("Error de Ubicación", errorMessage);
    }
  };

  // HTML con mapa MapLibre embebido
  const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Mapa</title>
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    #map {
      width: 100%;
      height: 100%;
    }
    .location-button {
      position: absolute;
      bottom: 100px;
      right: 10px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: white;
      border: 2px solid rgba(0,0,0,0.1);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 1000;
      -webkit-tap-highlight-color: transparent;
    }
    .location-button:active {
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <button class="location-button" onclick="getUserLocation()">📍</button>
  
  <script>
    // Inicializar mapa
    const map = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap'
          }
        },
        layers: [{
          id: 'osm-tiles-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }]
      },
      center: [-72.59, -38.74], // Temuco, Chile
      zoom: 13
    });

    // Agregar controles de navegación
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    let userMarker = null;

    // Función para actualizar ubicación del usuario (llamada desde React Native)
    window.updateUserLocation = function(longitude, latitude, accuracy) {
      console.log('Updating location:', longitude, latitude, accuracy);
      
      // Notificar a React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'location',
        data: { longitude, latitude, accuracy }
      }));

      // Centrar mapa
      map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        duration: 2000
      });

      // Agregar/actualizar marcador
      if (userMarker) {
        userMarker.remove();
      }

      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4285F4';
      el.style.border = '4px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

      userMarker = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map);
    };

    // Función para el botón de ubicación
    function getUserLocation() {
      // Notificar a React Native que necesitamos ubicación
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'requestLocation'
      }));
    }

    // Notificar cuando el mapa esté listo
    map.on('load', () => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'ready'
      }));
    });
  </script>
</body>
</html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("[MobileMapView] Message from WebView:", data);

      if (data.type === "ready") {
        setLoading(false);
        setMapReady(true);
      } else if (data.type === "requestLocation") {
        // El usuario presionó el botón de ubicación
        getUserLocation();
      } else if (data.type === "error") {
        console.warn("[MobileMapView] Error:", data.message);
      } else if (data.type === "location") {
        console.log("[MobileMapView] Location:", data.data);
      }
    } catch (error) {
      console.error("[MobileMapView] Error parsing message:", error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        geolocationEnabled={true}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("[MobileMapView] WebView error:", nativeEvent);
        }}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});
