import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { puede } from '../utils/permisos';

export default function Tabla_centros_comunitarios({ data, onNavigate, usuario }) {
  const handleNavigate = (destino) => {
    if (typeof onNavigate === 'function') {
      onNavigate(destino);
    } else {
      console.warn('onNavigate no fue pasado al componente Tabla_personas_a_cargo');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell,styles.dataColumn]}>{item.id}</Text>
      <Text style={[styles.cell,styles.dataColumn]}>{item.nombre_centro}</Text>
      <Text style={[styles.cell,styles.dataColumn]}>{item.direccion}</Text>
      <Text style={[styles.cell,styles.dataColumn]}>{item.sector}</Text>
      <Text style={[styles.cell,styles.dataColumn]}>{item.rut_encargado}</Text>
      <Text style={[styles.cell,styles.dataColumn]}>{item.nombre_encargado}</Text>
      {(puede(usuario,'editar_centro') || puede(usuario,'borrar_centro')) && (
        <View style={styles.actionsInline}>
          {puede(usuario,'editar_centro') && (
            <Button title="🖊️" onPress={() => handleNavigate('en_construccion')} color="#ffc107" />
          )}
          {puede(usuario,'borrar_centro') && (
            <Button title="✖️" onPress={() => handleNavigate('en_construccion')} color="#dc3545" />
          )}
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerCell,styles.dataColumn]}>id</Text>
      <Text style={[styles.headerCell,styles.dataColumn]}>Nombre Centro</Text>
      <Text style={[styles.headerCell,styles.dataColumn]}>Dirección</Text>
      <Text style={[styles.headerCell,styles.dataColumn]}>Sector</Text>
      <Text style={[styles.headerCell,styles.dataColumn]}>RUT Encargado</Text>
      <Text style={[styles.headerCell,styles.dataColumn]}>Nombre Encargado</Text>
      {(puede(usuario,'editar_centro') || puede(usuario,'borrar_centro')) && (
        <View>
          <Text style={[styles.headerCell,styles.dataColumn]}>Acciones</Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.rut_encargado ? `${item.rut_encargado}-${index}` : `${item.nombre_centro}-${index}`}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  //  --- Estilos de Columna Unificados ---
  dataColumn: {
    flex: 1, // Ocupa más espacio
    textAlign: 'center', // Alineado a la izquierda para mejor lectura
  },
  actionsInline: {
    flexDirection: 'row',
    gap: 4,
  }
});