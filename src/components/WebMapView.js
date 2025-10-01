/**
 * WebMapView - Implementación de Mapa para Web
 *
 * Usa MapLibre GL JS (fork open-source de Mapbox GL) para renderizar mapas
 * interactivos en navegadores web sin necesidad de tokens o autenticación.
 *
 * Características:
 * - Renderizado vectorial de alta calidad
 * - Interacciones táctiles (zoom, pan, rotate)
 * - Limpieza automática de recursos al desmontar
 * - 100% gratuito y open-source
 *
 * Documentación: https://maplibre.org/maplibre-gl-js/docs/
 */

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function WebMapView({ style }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [lowAccuracyWarning, setLowAccuracyWarning] = useState(false);

  useEffect(() => {
    // Evitar reinicialización si el mapa ya existe
    if (map.current) return;

    try {
      // Estilo completo con tiles raster de OpenStreetMap
      const osmRasterStyle = {
        version: 8,
        name: "OpenStreetMap",
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };

      // Inicializar mapa MapLibre GL (no requiere token)
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: osmRasterStyle,

        // Coordenadas iniciales (centrado en Temuco, Chile)
        // 38°44′24″S 72°35′24″O
        center: [-72.59, -38.74], // [longitud, latitud]
        zoom: 13, // Nivel de zoom (0-22, siendo 0 el más alejado)

        // Opciones de interacción
        pitch: 0, // Inclinación del mapa (0-60 grados)
        bearing: 0, // Rotación del mapa (0-360 grados)
      });

      // Agregar controles de navegación (zoom +/-, brújula)
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      // Agregar control de escala
      map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");

      // Event listener: cuando el mapa termina de cargar
      map.current.on("load", () => {
        console.log(
          "[WebMapView] Mapa cargado exitosamente con tiles de OpenStreetMap"
        );

        // NO obtener ubicación automáticamente en web desktop
        // El usuario puede usar el botón 📍 si quiere intentarlo
        // getUserLocation();
      }); // Event listener: manejo de errores
      map.current.on("error", (e) => {
        console.error("[WebMapView] Error en el mapa:", e);
        setError("Error al cargar el mapa");
      });
    } catch (err) {
      console.error("[WebMapView] Error al inicializar:", err);
      setError("No se pudo inicializar el mapa");
    }

    // Cleanup: destruir el mapa al desmontar el componente
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Array vacío = ejecutar solo una vez al montar

  // Función para obtener la ubicación del usuario
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.warn(
        "[WebMapView] Geolocalización no disponible en este navegador"
      );
      return;
    }

    console.log("[WebMapView] Solicitando ubicación...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude, accuracy, altitude, heading, speed } =
          position.coords;

        console.log("=== UBICACIÓN OBTENIDA ===");
        console.log(`Latitud: ${latitude}`);
        console.log(`Longitud: ${longitude}`);
        console.log(`Precisión: ${accuracy} metros`);
        console.log(`Altitud: ${altitude}`);
        console.log(`Dirección: ${heading}`);
        console.log(`Velocidad: ${speed}`);
        console.log(
          `Timestamp: ${new Date(position.timestamp).toLocaleString()}`
        );
        console.log("========================");

        setUserLocation([longitude, latitude]);
        setLocationAccuracy(accuracy);

        // Verificar si la precisión es muy baja (ubicación por IP)
        if (accuracy > 50000) {
          // Más de 50km = ubicación por IP
          console.warn(
            "[WebMapView] ⚠️ UBICACIÓN MUY IMPRECISA - Usando geolocalización por IP"
          );
          setLowAccuracyWarning(true);
          setError(null); // Limpiar error anterior

          // NO centrar el mapa automáticamente si la precisión es muy baja
          // Dejar que el usuario decida si usar esta ubicación
          return;
        } else {
          setLowAccuracyWarning(false);
        }

        // Centrar el mapa en la ubicación del usuario
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16, // Zoom más cercano para ver mejor
            duration: 2000,
          });

          // Agregar marcador de ubicación del usuario
          if (userMarker.current) {
            userMarker.current.remove();
          }

          // Crear contenedor del marcador
          const el = document.createElement("div");
          el.className = "user-location-marker";
          el.style.width = "24px";
          el.style.height = "24px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = "#4285F4";
          el.style.border = "4px solid white";
          el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
          el.style.cursor = "pointer";
          el.title = `Tu ubicación (±${Math.round(accuracy)}m)`;

          userMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Agregar círculo de precisión si la precisión es mayor a 50m
          if (accuracy > 50) {
            console.warn(
              `[WebMapView] Precisión baja: ${accuracy} metros. La ubicación puede no ser exacta.`
            );

            // Agregar círculo de precisión al mapa
            if (map.current.getSource("accuracy-circle")) {
              map.current.removeLayer("accuracy-circle-layer");
              map.current.removeSource("accuracy-circle");
            }

            map.current.addSource("accuracy-circle", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                properties: {
                  radius: accuracy,
                },
              },
            });

            map.current.addLayer({
              id: "accuracy-circle-layer",
              type: "circle",
              source: "accuracy-circle",
              paint: {
                "circle-radius": {
                  stops: [
                    [0, 0],
                    [20, accuracy / 10],
                  ],
                  base: 2,
                },
                "circle-color": "#4285F4",
                "circle-opacity": 0.1,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#4285F4",
                "circle-stroke-opacity": 0.4,
              },
            });
          }
        }
      },
      (error) => {
        console.error("=== ERROR DE GEOLOCALIZACIÓN ===");
        console.error(`Código: ${error.code}`);
        console.error(`Mensaje: ${error.message}`);
        console.error("================================");

        let errorMessage = "Error al obtener ubicación";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Ubicación no disponible. Verifica tu conexión GPS/WiFi.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intentando nuevamente...";
            // Reintentar automáticamente
            setTimeout(getUserLocation, 2000);
            return;
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true, // Usar GPS de alta precisión
        timeout: 15000, // 15 segundos de timeout
        maximumAge: 0, // No usar ubicación en caché
      }
    );
  };

  // Renderizar contenedor del mapa
  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      {/* Contenedor donde se renderiza el mapa */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Botón para re-centrar en ubicación del usuario */}
      <button
        onClick={getUserLocation}
        style={{
          position: "absolute",
          bottom: "100px",
          right: "10px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "2px solid rgba(0,0,0,0.1)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          zIndex: 1000,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f0f0f0";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.transform = "scale(1)";
        }}
        title="Centrar en mi ubicación"
      >
        📍
      </button>

      {/* Advertencia de baja precisión */}
      {lowAccuracyWarning && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 152, 0, 0.95)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            ⚠️ Ubicación Imprecisa Detectada
          </div>
          <div style={{ fontSize: "12px" }}>
            La ubicación mostrada es aproximada (±
            {Math.round(locationAccuracy / 1000)}km).
            <br />
            Para mejor precisión, prueba en un dispositivo móvil con GPS.
          </div>
        </div>
      )}

      {/* Mostrar coordenadas actuales (para debugging) */}
      {userLocation && !lowAccuracyWarning && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px 12px",
            borderRadius: "5px",
            fontSize: "12px",
            fontFamily: "monospace",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <div>
            <strong>Tu ubicación:</strong>
          </div>
          <div>Lat: {userLocation[1].toFixed(6)}</div>
          <div>Lng: {userLocation[0].toFixed(6)}</div>
          <div style={{ color: locationAccuracy < 100 ? "green" : "orange" }}>
            ±{Math.round(locationAccuracy)}m
          </div>
        </div>
      )}

      {/* Mostrar mensaje de error si algo falla */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
