import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { puede } from "../utils/permisos";
import PaginationControls from "./pagination_controls";

export default function Tabla_centros_comunitarios({
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
        "onNavigate no fue pasado al componente Tabla_centros_comunitarios"
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.id ?? item.id_centro ?? "-"}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.nombre ?? item.nombre_centro ?? "-"}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.direccion ?? item.direccion_centro ?? "-"}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.sector ?? item.sector_centro ?? "-"}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.telefono_centro ?? "-"}
      </Text>
      <Text style={[styles.cell, styles.dataColumn]}>
        {item.email_centro ?? "-"}
      </Text>
      {(puede(usuario, "editar_centro") || puede(usuario, "borrar_centro")) && (
        <View style={styles.actionsInline}>
          {puede(usuario, "editar_centro") && (
            <Button
              title="🖊️"
              onPress={() => handleNavigate("en_construccion")}
              color="#ffc107"
            />
          )}
          {puede(usuario, "borrar_centro") && (
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
      <Text style={[styles.headerCell, styles.dataColumn]}>ID</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Nombre Centro</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Dirección</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Sector</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Teléfono</Text>
      <Text style={[styles.headerCell, styles.dataColumn]}>Email</Text>
      {(puede(usuario, "editar_centro") || puede(usuario, "borrar_centro")) && (
        <View>
          <Text style={[styles.headerCell, styles.dataColumn]}>Acciones</Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => {
        if (item.id ?? item.id_centro) {
          return `${item.id ?? item.id_centro}`;
        }
        return `${item.nombre ?? item.nombre_centro ?? "centro"}-${index}`;
      }}
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
