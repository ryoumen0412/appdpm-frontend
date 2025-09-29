import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { borrarToken } from '../api/auth';
import { fetchCentros_comunitarios } from '../api/centros_comunitarios';
import Tabla_centros_comunitarios from '../components/tabla_centros_comunitarios';
import HeaderBar from '../components/header_bar';
import { puede } from '../utils/permisos';

export default function Ver_centros_comunitarios({ usuario, onLogout, onNavigate }) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargardatos = async () => {
      try {
        setCargando(true);
        const data = await fetchCentros_comunitarios();
        setDatos(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar centros comunitarios:', err);
        setError('Error al cargar los datos');
      } finally {
        setCargando(false);
      }
    };
    cargardatos();
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
          <Text style={styles.title}>Centros Comunitarios</Text>
        </View>
        
        {puede(usuario,'crear_centro') && (
          <View style={styles.actionsContainer}>
            <Button title="Añadir Centro" onPress={() => onNavigate('en_construccion')} color="#28a745" />
          </View>
        )}

        {cargando && <Text style={styles.loading}>Cargando centros comunitaros...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
  {!cargando && !error && <Tabla_centros_comunitarios data={datos} onNavigate={onNavigate} usuario={usuario} />}      
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'right',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
