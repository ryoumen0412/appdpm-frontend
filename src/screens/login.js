import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { login, guardarToken } from '../api/auth';

export default function Login({ onLogin }) {
  const [rut_usuario, setRut_usuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRutChange = (text) => {
    // Filtrar solo números y guion
    const filteredText = text.replace(/[^0-9-]/g, '');
    setRut_usuario(filteredText);
  };

  const handlePasswordChange = (text) => {
    // Validar contraseña: solo letras, números y símbolos limitados !@#$%^&*()_+ ,.
    const filteredText = text.replace(/[^a-zA-Z0-9!@#$%^&*()_+\.,]/g, '');
    // Limitar longitud máxima
    const limitedText = filteredText.substring(0, 100);
    setPassword(limitedText);
  };

  const validatePassword = (password) => {
    if (!password || password.length === 0) {
      return "La contraseña no puede estar vacía";
    }
    if (password.length > 20) {
      return "La contraseña es demasiado larga";
    }
    // Verificar caracteres ASCII imprimibles
    for (let char of password) {
      if (char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126) {
        return "La contraseña contiene caracteres no permitidos";
      }
    }
    return null; // Válida
  };

  const handleLogin = async () => {
    // Validar contraseña antes de enviar
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const res = await login(rut_usuario, password);
    //console.log('Respuesta del backend:', res.token);
    if (res.success && res.token) {
      await guardarToken(res.token);
      onLogin(rut_usuario); // ← Cambiado a rut_usuario
    } else {
      setError(res.error || 'Error desconocido');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="RUT (ej: 12345678-9)"
          keyboardType="numeric"
          value={rut_usuario}
          onChangeText={handleRutChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
        <Button title="Entrar" onPress={handleLogin} style={styles.coolButton} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // ← centra horizontalmente
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4, // sombra en Android
    shadowColor: '#000', // sombra en iOS/web
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  coolButton: {
    color: 'blue',
    borderRadius: 30,
    padding: 10,
    backgroundColor: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  }
});