import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { crearPersona } from "../api/personas_a_cargo";
import { puede } from "../utils/permisos";
import HeaderBar from "../components/header_bar";

export default function CrearPersonaACargo({ usuario, onNavigate, onLogout }) {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    correo_electronico: "",
    telefono: "",
    fecha_nacimiento: "", // YYYY-MM-DD
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  if (!puede(usuario, "crear_persona")) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderBar usuario={usuario} onLogout={onLogout} />
        <View style={styles.denegadoContainer}>
          <Text style={styles.denegado}>
            No autorizado para crear personas.
          </Text>
        </View>
      </View>
    );
  }

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validar = () => {
    if (!form.rut) return "RUT requerido";
    if (!/^[0-9-]+$/.test(form.rut)) return "RUT inválido";
    if (!form.nombre) return "Nombre requerido";
    if (!form.apellido) return "Apellido requerido";
    if (form.correo_electronico && !/.+@.+\..+/.test(form.correo_electronico))
      return "Correo inválido";
    if (
      form.fecha_nacimiento &&
      !/^\d{4}-\d{2}-\d{2}$/.test(form.fecha_nacimiento)
    )
      return "Fecha debe ser YYYY-MM-DD";
    return null;
  };

  const handleSubmit = async () => {
    const val = validar();
    if (val) {
      setError(val);
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      await crearPersona(form);
      Alert.alert("Éxito", "Persona creada", [
        { text: "OK", onPress: () => onNavigate("ver_personas_a_cargo") },
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar usuario={usuario} onLogout={onLogout} />
      <View style={styles.container}>
        <Text style={styles.title}>Crear Persona a Cargo</Text>
        {[
          "rut",
          "nombre",
          "apellido",
          "correo_electronico",
          "telefono",
          "fecha_nacimiento",
        ].map((campo) => (
          <TextInput
            key={campo}
            style={styles.input}
            placeholder={campo.replace("_", " ")}
            value={form[campo]}
            onChangeText={(v) => updateField(campo, v)}
          />
        ))}
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttons}>
          <Button
            title="Cancelar"
            color="#6c757d"
            onPress={() => onNavigate("ver_personas_a_cargo")}
          />
          <Button
            title={enviando ? "Guardando..." : "Guardar"}
            onPress={handleSubmit}
            disabled={enviando}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  denegadoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  denegado: { color: "red", fontSize: 16 },
});
