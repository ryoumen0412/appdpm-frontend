import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_LOGIN, API_URL_TOKEN } from '@env'; 

const API_LOGIN = API_URL_LOGIN;
const API_TOKEN = API_URL_TOKEN;

export async function login(rut_usr, password) {
  try {
    const res = await fetch(API_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut_usr, password }),
    });
    return await res.json();
  } catch (err) {
    return { error: 'No se pudo conectar al servidor' };
  }
}

export async function guardarToken(token) {
  await AsyncStorage.setItem('token', token);
}

export async function obtenerToken() {
  return await AsyncStorage.getItem('token');
}

export async function borrarToken() {
  await AsyncStorage.removeItem('token');
}

export async function verificarToken() {
  const token = await obtenerToken();
  if (!token) return { error: 'No hay token' };

  try {
    const res = await fetch(API_TOKEN, {
      method: 'GET',
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (err) {
    return { error: 'No se pudo verificar el token' };
  }
}