import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import HeaderBar from "../components/header_bar";

const { width } = Dimensions.get("window");

export default function Home({ usuario, onLogout, onNavigate }) {
  // Datos de ejemplo para la grid - puedes personalizar esto
  const menuItems = [
    {
      id: "1",
      title: "Personas a cargo",
      icon: "👮",
      action: "ver_personas_a_cargo",
    },
    {
      id: "2",
      title: "Trabajadores y apoyos",
      icon: "👷",
      action: "ver_trabajadores_apoyo",
    },
    {
      id: "3",
      title: "Centros Comunitarios",
      icon: "🏠",
      action: "ver_centros_comunitarios",
    },
    { id: "4", title: "Mapa Interactivo", icon: "🗺️", action: "ver_mapa" },
    { id: "5", title: "Reportes", icon: "📊", action: "reportes" },
    { id: "6", title: "Mensajes", icon: "💬", action: "mensajes" },
    { id: "7", title: "Calendario", icon: "📅", action: "calendario" },
    { id: "8", title: "Documentos", icon: "📄", action: "documentos" },
    { id: "9", title: "Estadísticas", icon: "📈", action: "estadisticas" },
    { id: "10", title: "Ayuda", icon: "❓", action: "ayuda" },
    { id: "11", title: "Soporte", icon: "🆘", action: "soporte" },
    { id: "12", title: "Notificaciones", icon: "🔔", action: "notificaciones" },
    { id: "13", title: "Tareas", icon: "✅", action: "tareas" },
    // Agrega más items según necesites
  ];

  const handleMenuPress = (action) => {
    if (onNavigate) {
      onNavigate(action);
    } else {
      console.log("Navegando a:", action);
      // Aquí puedes agregar lógica específica para cada acción
    }
  };

  const handleLogout = async () => {
    if (typeof onLogout === "function") {
      await onLogout();
    }
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.action)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.menuTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar usuario={usuario} onLogout={handleLogout} />
      <View style={styles.container}>
        <Text style={styles.title}>Menú Principal</Text>
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    paddingHorizontal: 20,
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  menuItem: {
    flex: 1,
    aspectRatio: 1, // Cuadrado perfecto
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: (width - 60) / 3, // Altura mínima basada en el ancho disponible
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 4,
  },
});
