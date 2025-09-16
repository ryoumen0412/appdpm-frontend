import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HeaderBar({ usuario, onLogout }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Dirección de personas mayores Temuco</Text>
      <View style={styles.right}>
        <Text style={styles.user}>👤 {usuario}</Text>
        <Button title="Cerrar sesión" onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  user: {
    fontSize: 14,
    marginRight: 8,
  },
});