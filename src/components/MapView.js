/**
 * MapView - Wrapper Multiplataforma
 *
 * Este componente detecta automáticamente la plataforma y renderiza
 * la implementación de mapa apropiada:
 * - Web: Usa MapLibre GL JS
 * - iOS/Android: Usa @rnmapbox/maps (SDK nativo)
 *
 * Uso:
 * <MapView style={{ flex: 1 }} />
 */

import React from "react";
import { Platform } from "react-native";

// Importación condicional según plataforma
let WebMapView = null;
let MobileMapView = null;

if (Platform.OS === "web") {
  WebMapView = require("./WebMapView").default;
} else {
  MobileMapView = require("./MobileMapView").default;
}

export default function MapView(props) {
  // Web usa MapLibre nativo del navegador
  if (Platform.OS === "web" && WebMapView) {
    return <WebMapView {...props} />;
  }

  // iOS/Android usan WebView con MapLibre embebido
  if (MobileMapView) {
    return <MobileMapView {...props} />;
  }

  // Fallback (no debería ocurrir)
  return null;
}
