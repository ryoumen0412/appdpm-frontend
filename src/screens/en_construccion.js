import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import HeaderBar from '../components/header_bar';

// Recibe 'pantallaAnterior' como prop
export default function EnConstruccion({ usuario, onLogout, onNavigate, pantallaAnterior }) {
  return (
    <View style={styles.container}>
      <HeaderBar
        usuario={usuario}
        onLogout={onLogout}
        onNavigate={onNavigate}
        pantallaActual="En Construcción"
      />
      <View style={styles.content}>
        <Text style={styles.icon}>🚧</Text>
        <Text style={styles.title}>Página en Construcción</Text>
        <Text style={styles.subtitle}>
          Esta funcionalidad estará disponible próximamente.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Volver a la Página Anterior"
            // Navega a la pantalla anterior guardada
            onPress={() => onNavigate(pantallaAnterior || 'home')}
            color="#007BFF"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '60%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});