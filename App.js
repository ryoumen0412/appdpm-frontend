import React, { useState, useEffect } from 'react';
import Login from './src/screens/login';
import Home from './src/screens/home';
import Ver_personas_a_cargo from './src/screens/ver_personas_a_cargo';
import CrearPersonaACargo from './src/screens/crear_persona_a_cargo';
import EditarPersonaACargo from './src/screens/editar_persona_a_cargo';
import Ver_trabajadores_apoyo from './src/screens/ver_trabajadores_apoyo';
import Ver_centros_comunitarios from './src/screens/ver_centros_comunitarios';
import EnConstruccion from './src/screens/en_construccion';
import { verificarToken } from './src/api/auth';
import { StyleSheet } from 'react-native';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantallaActual, setPantallaActual] = useState('home');
  const [pantallaAnterior, setPantallaAnterior] = useState('home'); // Nuevo estado
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null); // Para editar
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const validarSesion = async () => {
      const res = await verificarToken();
      // Esperamos ahora que el backend devuelva rut_usuario y nivel_usuario
      if (!res.error && res.rut_usuario && res.nivel_usuario != null) {
        // Construir objeto consistente con el usado tras login
        setUsuario({
          rut: res.rut_usuario,
          nivel: res.nivel_usuario,
          nombre: null, // Aún no tenemos nombre; se podría ampliar el backend si fuese necesario
        });
      }
      setCargando(false);
    };
    validarSesion();
  }, []);

  // Función de navegación actualizada
  const handleNavigate = (pantalla, opciones = {}) => {
    setPantallaAnterior(pantallaActual);
    if (opciones && opciones.registro) {
      setRegistroSeleccionado(opciones.registro);
    } else if (!opciones || !opciones.preserveRegistro) {
      setRegistroSeleccionado(null);
    }
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
        <Ver_personas_a_cargo
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case 'crear_persona_a_cargo':
      return (
        <CrearPersonaACargo
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case 'editar_persona_a_cargo':
      return (
        <EditarPersonaACargo
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          registroSeleccionadoRut={registroSeleccionado?.rut}
        />
      );
    case 'ver_trabajadores_apoyo':
      return (
        <Ver_trabajadores_apoyo
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case 'ver_centros_comunitarios':
      return (
        <Ver_centros_comunitarios
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case 'en_construccion': // Pantalla "En Construcción"
      return (
        <EnConstruccion
          usuario={usuario}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          pantallaAnterior={pantallaAnterior} // Pasa la pantalla anterior
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