import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";

export async function guardarToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.warn("No se pudo guardar el token", error);
  }
}

export async function obtenerToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.warn("No se pudo obtener el token", error);
    return null;
  }
}

export async function borrarToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.warn("No se pudo borrar el token", error);
  }
}

export { TOKEN_KEY };
