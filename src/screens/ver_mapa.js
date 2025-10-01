/**
 * Pantalla de Mapa Interactivo
 *
 * Pantalla dedicada para visualizar mapas interactivos multiplataforma.
 * Usa MapLibre GL (web) o @rnmapbox/maps (iOS/Android) según la plataforma.
 *
 * Funcionalidades:
 * - Ubicación en tiempo real del usuario
 * - Marcador de posición actual
 * - Controles de navegación y zoom
 *
 * Funcionalidades futuras sugeridas:
 * - Mostrar ubicaciones de centros comunitarios
 * - Mostrar rutas o áreas de servicio
 * - Filtros interactivos por tipo de servicio
 * - Búsqueda de direcciones
 * - Marcadores personalizados con información detallada
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, Text, Alert } from "react-native";
import * as Location from "expo-location";
import MapView from "../components/MapView";

export default function VerMapa() {
  // Mapa disponible en todas las plataformas
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mobileMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  mobileMessageIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  mobileMessageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  mobileMessageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  mobileMessageBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  mobileMessageBoxText: {
    fontSize: 14,
    color: "#1976D2",
    textAlign: "center",
    lineHeight: 20,
  },
  mobileMessageFooter: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
  },
});
