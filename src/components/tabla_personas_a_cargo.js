import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function Tabla_personas_a_cargo({ data }) {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.rut}</Text>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.apellido}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.rut}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerCell}>RUT</Text>
          <Text style={styles.headerCell}>Nombre</Text>
          <Text style={styles.headerCell}>Apellido</Text>
        </View>
      }
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
});