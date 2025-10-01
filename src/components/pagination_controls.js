import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PaginationControls({ pagination, onChangePage }) {
  if (!pagination) {
    return null;
  }

  const { page, pages, total, has_prev, has_next, prev_num, next_num } =
    pagination;

  const handleChange = (target) => {
    if (!onChangePage || !target || target === page) {
      return;
    }
    const clamped = Math.max(1, Math.min(pages || target, target));
    onChangePage(clamped);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Página {page} de {pages || 1} · Total {total ?? 0}
      </Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, !has_prev && styles.disabledButton]}
          onPress={() => handleChange(1)}
          disabled={!has_prev}
        >
          <Text style={[styles.buttonText, !has_prev && styles.disabledText]}>
            « Primera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !has_prev && styles.disabledButton]}
          onPress={() => handleChange(prev_num || page - 1)}
          disabled={!has_prev}
        >
          <Text style={[styles.buttonText, !has_prev && styles.disabledText]}>
            ‹ Anterior
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !has_next && styles.disabledButton]}
          onPress={() => handleChange(next_num || page + 1)}
          disabled={!has_next}
        >
          <Text style={[styles.buttonText, !has_next && styles.disabledText]}>
            Siguiente ›
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !has_next && styles.disabledButton]}
          onPress={() => handleChange(pages)}
          disabled={!has_next}
        >
          <Text style={[styles.buttonText, !has_next && styles.disabledText]}>
            Última »
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: "center",
  },
  info: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#d0d0d0",
  },
  disabledText: {
    color: "#888",
  },
});
