import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { actualizarPersona, obtenerPersonaLocal } from '../api/personas_a_cargo';
import { obtenerToken } from '../api/auth';
import { puede } from '../utils/permisos';
import HeaderBar from '../components/header_bar';

export default function EditarPersonaACargo({ usuario, onNavigate, onLogout, registroSeleccionadoRut }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: '',
    fecha_nacimiento: '',
  });
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const persona = await obtenerPersonaLocal(registroSeleccionadoRut);
        if (persona) {
          // persona.fecha_nacimiento ejemplo: '05/04/1980 (44 años)' o 'No especificada'
          let fechaISO = '';
          if (persona.fecha_nacimiento) {
            const m = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})/.exec(persona.fecha_nacimiento);
            if (m) {
              const [, dd, mm, yyyy] = m;
              fechaISO = `${yyyy}-${mm}-${dd}`;
            }
          }
          setForm({
            nombre: persona.nombre || '',
            apellido: persona.apellido || '',
            correo_electronico: persona.correo_electronico || '',
            telefono: persona.telefono || '',
            fecha_nacimiento: fechaISO,
          });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [registroSeleccionadoRut]);

  if (!puede(usuario,'editar_persona')) {
    return (
      <View style={{ flex:1 }}>
        <HeaderBar usuario={usuario} onLogout={onLogout} />
        <View style={styles.denegadoContainer}><Text style={styles.denegado}>No autorizado para editar personas.</Text></View>
      </View>
    );
  }

  const updateField = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido) {
      Alert.alert('Validación','Nombre y Apellido son obligatorios');
      return;
    }
    setError(null); setEnviando(true);
    try {
      const token = await obtenerToken();
      await actualizarPersona(registroSeleccionadoRut, form, token);
        Alert.alert('Éxito','Persona actualizada correctamente');
        onNavigate('ver_personas_a_cargo');
    } catch (e) {
      const msg = e.message || 'Error desconocido';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <View style={{ flex:1 }}>
        <HeaderBar usuario={usuario} onLogout={onLogout} />
        <View style={styles.loadingBox}><Text>Cargando...</Text></View>
      </View>
    );
  }

  return (
    <View style={{ flex:1 }}>
      <HeaderBar usuario={usuario} onLogout={onLogout} />
      <View style={styles.container}>
        <Text style={styles.title}>Editar Persona ({registroSeleccionadoRut})</Text>
        {['nombre','apellido','correo_electronico','telefono'].map(campo => (
          <TextInput
            key={campo}
            style={styles.input}
            placeholder={campo.replace('_',' ')}
            value={form[campo]}
            onChangeText={v => updateField(campo,v)}
          />
        ))}
        {/* Campo fecha (solo input tipo date; en native RN puro no existe, así que se mostrará fallback texto editable) */}
        <View style={styles.dateWrapper}>
          <Text style={styles.dateLabel}>Fecha de nacimiento</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={form.fecha_nacimiento || ''}
              onChange={e => updateField('fecha_nacimiento', e.target.value)}
              max={new Date().toISOString().slice(0,10)}
              style={styles.webDateInput}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={form.fecha_nacimiento}
              onChangeText={v => updateField('fecha_nacimiento', v)}
            />
          )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttons}>
            <Button title="Cancelar" color="#6c757d" onPress={() => onNavigate('ver_personas_a_cargo')} />
            <Button title={enviando ? 'Guardando...' : 'Guardar'} onPress={handleSubmit} disabled={enviando} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:12 },
  input: { borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:6, marginBottom:10 },
  dateWrapper: { marginBottom:16 },
  dateLabel: { fontWeight:'600', marginBottom:6 },
  webDateInput: { border:'1px solid #ccc', padding:10, borderRadius:6, backgroundColor:'#fff' },
  error: { color:'red', marginBottom:10 },
  buttons: { flexDirection:'row', justifyContent:'space-between', gap:10 },
  loadingBox: { flex:1, alignItems:'center', justifyContent:'center' },
  denegadoContainer: { flex:1, alignItems:'center', justifyContent:'center' },
  denegado: { color:'red', fontSize:16 }
});
