import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { borrarToken } from '../api/auth';
import { fetchPersonas_a_cargo } from '../api/personas_a_cargo';
import Tabla_personas_a_cargo from '../components/tabla_personas_a_cargo';
import HeaderBar from '../components/header_bar';

export default function Ver_personas_a_cargo({ usuario, onLogout, onNavigate }) {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        setCargando(true);
        const data = await fetchPersonas_a_cargo();
        setPersonas(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar personas:', err);
        setError('Error al cargar los datos');
      } finally {
        setCargando(false);
      }
    };
    cargarPersonas();
  }, []);

  const handleLogout = async () => {
    await borrarToken();
    onLogout();
  };

  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar usuario={usuario} onLogout={handleLogout} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
            <Text style={styles.backButtonText}>← Volver al Menú</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Personas a Cargo</Text>
        </View>
        
        {cargando && <Text style={styles.loading}>Cargando personas...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {!cargando && !error && <Tabla_personas_a_cargo data={personas} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
