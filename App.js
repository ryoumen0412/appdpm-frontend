import React, { useState, useEffect } from 'react';
import Login from './src/screens/login';
import Home from './src/screens/home';
import Ver_personas_a_cargo from './src/screens/ver_personas_a_cargo';
import { verificarToken } from './src/api/auth';
import { StyleSheet, View } from 'react-native';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantallaActual, setPantallaActual] = useState('home');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const validarSesion = async () => {
      const res = await verificarToken();
      if (res.mensaje) {
        const nombre = res.mensaje.split(',')[0].replace('Hola ', '');
        setUsuario(nombre);
      }
      setCargando(false);
    };
    validarSesion();
  }, []);

  const handleNavigate = (pantalla) => {
    setPantallaActual(pantalla);
  };

  const handleLogout = () => {
    setUsuario(null);
    setPantallaActual('home');
  };

  if (cargando) return null;

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  // Sistema de navegación por estados
  switch (pantallaActual) {
    case 'ver_personas_a_cargo':
      return (
        <Ver_personas
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case 'home':
    default:
      return (
        <Home
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
});