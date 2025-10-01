import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { fetchTrabajadores_apoyo } from "../api/trabajadores_apoyo";
import Tabla_trabajadores_apoyo from "../components/tabla_trabajadores_apoyo";
import HeaderBar from "../components/header_bar";
import { puede } from "../utils/permisos";

export default function Ver_trabajadores_apoyo({
  usuario,
  onLogout,
  onNavigate,
}) {
  const [personas, setPersonas] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarTrabajadores = useCallback(async (page = 1) => {
    try {
      setCargando(true);
      const data = await fetchTrabajadores_apoyo({ page });
      setPersonas(data.items ?? []);
      setPaginacion(data.pagination ?? null);
      setError(null);
    } catch (err) {
      console.error("Error al cargar personas:", err);
      setError("Error al cargar los datos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTrabajadores();
  }, [cargarTrabajadores]);

  const handleChangePage = (page) => {
    if (!page || page === paginacion?.page) return;
    cargarTrabajadores(page);
  };

  const handleLogout = async () => {
    if (typeof onLogout === "function") {
      await onLogout();
    }
  };

  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate("home");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar usuario={usuario} onLogout={handleLogout} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.backButtonText}>← Volver al Menú</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Trabajadores de Apoyo</Text>
        </View>

        {puede(usuario, "crear_trabajador") && (
          <View style={styles.actionsContainer}>
            <Button
              title="Añadir Trabajador"
              onPress={() => onNavigate("en_construccion")}
              color="#28a745"
            />
          </View>
        )}

        {cargando && (
          <Text style={styles.loading}>Cargando trabajadores...</Text>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
        {!cargando && !error && (
          <Tabla_trabajadores_apoyo
            data={personas}
            paginacion={paginacion}
            onNavigate={onNavigate}
            usuario={usuario}
            onChangePage={handleChangePage}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "right",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
