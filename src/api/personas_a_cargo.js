import { API_URL_PERSONAS } from '@env';

export async function fetchPersonas_a_cargo() {
  try {
    const response = await fetch(API_URL_PERSONAS);
    if (!response.ok) throw new Error('Error al obtener datos');
    return await response.json();
  } catch (error) {
    throw error;
  }
}