import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { login, guardarToken } from "../api/auth";

export default function Login({ onLogin }) {
  const [rut_usuario, setRut_usuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRutChange = (text) => {
    // Filtrar números, guion y dígito verificador K/k
    const filteredText = text.replace(/[^0-9kK-]/g, "").toUpperCase();
    setRut_usuario(filteredText);
  };

  const validateRut = (rut) => {
    if (!rut || rut.length === 0) {
      return "El RUT no puede estar vacío";
    }
    if (rut.length < 9 || rut.length > 12) {
      return "El RUT debe tener entre 9 y 12 caracteres";
    }
    // Validar formato básico (números y guión)
    const rutPattern = /^[0-9]+-[0-9Kk]$/;
    if (!rutPattern.test(rut)) {
      return "Formato de RUT inválido (ej: 12345678-9)";
    }
    return null; // Válido
  };

  const handlePasswordChange = (text) => {
    // Validar contraseña: solo letras, números y símbolos limitados !@#$%^&*()_+ ,.
    const filteredText = text.replace(/[^a-zA-Z0-9!@#$%^&*()_+\.,]/g, "");
    // Limitar longitud máxima
    const limitedText = filteredText.substring(0, 100);
    setPassword(limitedText);
  };

  const validatePassword = (password) => {
    if (!password || password.length === 0) {
      return "La contraseña no puede estar vacía";
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    if (password.length > 100) {
      return "La contraseña es demasiado larga (máximo 100 caracteres)";
    }
    return null; // Válida
  };

  const handleLogin = async () => {
    // Limpiar error anterior
    setError("");

    // Validar RUT
    const rutError = validateRut(rut_usuario);
    if (rutError) {
      setError(rutError);
      return;
    }

    // Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      console.log("[LOGIN] Calling login API with:", {
        rut_usuario,
        passwordLength: password.length,
      });
      const result = await login(rut_usuario, password);
      console.log("[LOGIN] API response:", {
        success: result.success,
        status: result.status,
        hasData: !!result.data,
        hasToken: !!result.data?.token,
        error: result.error,
      });

      if (result.success && result.data?.token) {
        console.log("[LOGIN] Login successful, saving token...");
        await guardarToken(result.data.token);
        const usuarioApi = result.data.user;
        console.log("[LOGIN] User data:", usuarioApi);
        onLogin(mapearUsuarioDesdeApi(usuarioApi, rut_usuario));
      } else {
        // Mostrar el mensaje específico del backend
        const errorMsg =
          result.error ||
          result.message ||
          "Error desconocido al iniciar sesión";
        console.log("[LOGIN] Login failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("[LOGIN] Exception during login:", err);
      setError("Error de conexión. Verifica tu conexión a internet.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput
          style={[
            styles.input,
            error && rut_usuario === "" ? styles.inputError : null,
          ]}
          placeholder="RUT (ej: 12345678-9)"
          keyboardType="default"
          value={rut_usuario}
          onChangeText={handleRutChange}
        />
        <TextInput
          style={[
            styles.input,
            error && password === "" ? styles.inputError : null,
          ]}
          placeholder="Contraseña (mínimo 6 caracteres)"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
        <Button
          title="Entrar"
          onPress={handleLogin}
          color={error ? "#dc3545" : "#007BFF"}
        />
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function mapearUsuarioDesdeApi(usuarioApi, rutFallback) {
  if (usuarioApi && typeof usuarioApi === "object") {
    return {
      rut: usuarioApi.rut_usuario ?? rutFallback ?? null,
      nivel: usuarioApi.nivel_usuario ?? null,
      nombre: usuarioApi.user_usuario ?? usuarioApi.nombre ?? null,
      nivelNombre: usuarioApi.nivel_nombre ?? null,
    };
  }

  return {
    rut: rutFallback ?? null,
    nivel: null,
    nombre: null,
    nivelNombre: null,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // ← centra horizontalmente
    backgroundColor: "#f2f2f2",
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4, // sombra en Android
    shadowColor: "#000", // sombra en iOS/web
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  error: {
    color: "#721c24",
    flex: 1,
    fontSize: 14,
  },
});
