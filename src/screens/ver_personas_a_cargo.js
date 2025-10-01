import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { fetchPersonas_a_cargo } from "../api/personas_a_cargo";
import Tabla_personas_a_cargo from "../components/tabla_personas_a_cargo";
import HeaderBar from "../components/header_bar";
// Importar helper centralizado de permisos
import { puede } from "../utils/permisos";

export default function Ver_personas_a_cargo({
  usuario,
  onLogout,
  onNavigate,
}) {
  const [personas, setPersonas] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarPersonas = useCallback(async (page = 1) => {
    try {
      setCargando(true);
      const data = await fetchPersonas_a_cargo({ page });
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
    cargarPersonas();
  }, [cargarPersonas]);

  const handleChangePage = (page) => {
    if (!page || page === paginacion?.page) return;
    cargarPersonas(page);
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
          <Text style={styles.title}>Personas a Cargo</Text>
        </View>

        {cargando && <Text style={styles.loading}>Cargando personas...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {!cargando && !error && (
          <View style={styles.content}>
            {puede(usuario, "crear_persona") && (
              <View style={styles.actionsContainer}>
                <Button
                  title="Añadir Persona"
                  onPress={() => onNavigate("en_construccion")}
                  color="#28a745"
                />
              </View>
            )}
            <Tabla_personas_a_cargo
              data={personas}
              onNavigate={onNavigate}
              usuario={usuario}
              paginacion={paginacion}
              onChangePage={handleChangePage}
            />
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
});
