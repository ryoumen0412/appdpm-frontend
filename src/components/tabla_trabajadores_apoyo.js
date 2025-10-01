import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { puede } from "../utils/permisos";
import PaginationControls from "./pagination_controls";

export default function Tabla_trabajadores_apoyo({
  data,
  paginacion,
  onNavigate,
  usuario,
  onChangePage,
}) {
  const handleNavigate = (destino) => {
    if (typeof onNavigate === "function") {
      onNavigate(destino);
    } else {
      console.warn(
        "onNavigate no fue pasado al componente Tabla_trabajadores_apoyo"
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.dataColumn]}>{item.rut}</Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.nombre_trabajador}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>{item.apellidos}</Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.correo_electronico}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>{item.telefono}</Text>
      <Text style={[styles.cell, styles.dataColumn]}>{item.nombre_centro}</Text>
      <Text style={[styles.cell, styles.dataColumn]}>{item.cargo}</Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.fecha_nacimiento}
      </Text>
      {(puede(usuario, "editar_trabajador") ||
        puede(usuario, "borrar_trabajador")) && (
        <View style={styles.actionsInline}>
          {puede(usuario, "editar_trabajador") && (
            <Button
              title="🖊️"
              onPress={() => handleNavigate("en_construccion")}
              color="#ffc107"
            />
          )}
          {puede(usuario, "borrar_trabajador") && (
            <Button
              title="✖️"
              onPress={() => handleNavigate("en_construccion")}
              color="#dc3545"
            />
          )}
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerCell, styles.dataColumn]}>RUT</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Nombre</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Apellido</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>
        Correo Electrónico
      </Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Teléfono</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>
        Centro Comunitario
      </Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Cargo</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>
        Fecha de Nacimiento
      </Text>
      {(puede(usuario, "editar_trabajador") ||
        puede(usuario, "borrar_trabajador")) && (
        <View>
          <Text style={[styles.headerCell, styles.dataColumn]}>Acciones</Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.rut}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={
        paginacion
          ? () => (
              <PaginationControls
                pagination={paginacion}
                onChangePage={onChangePage}
              />
            )
          : null
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  //  --- Estilos de Columna Unificados ---
  dataColumn: {
    flex: 1, // Ocupa más espacio
    textAlign: "center", // Alineado a la izquierda para mejor lectura
  },
  actionsInline: {
    flexDirection: "row",
    gap: 4,
  },
});
