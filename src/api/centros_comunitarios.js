import { API_URL_CENTROS_COMUNITARIOS } from '@env';

export async function fetchCentros_comunitarios() {
  try {
    const response = await fetch(API_URL_CENTROS_COMUNITARIOS);
    if (!response.ok) throw new Error('Error al obtener datos');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// -----------------------------
// Helpers CRUD adicionales
// -----------------------------
async function handleResponse(res) {
  let body = null; try { body = await res.json(); } catch {}
  if (!res.ok) {
    const msg = body?.error || body?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export async function crearCentro(payload, token) {
  const res = await fetch(API_URL_CENTROS_COMUNITARIOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function actualizarCentro(id, payload, token) {
  if (id == null) throw new Error('ID requerido');
  const res = await fetch(`${API_URL_CENTROS_COMUNITARIOS}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function eliminarCentro(id, token) {
  if (id == null) throw new Error('ID requerido');
  const res = await fetch(`${API_URL_CENTROS_COMUNITARIOS}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
  return handleResponse(res);
}

export async function obtenerCentroLocal(id) {
  const list = await fetchCentros_comunitarios();
  return list.find(c => c.id === id) || null;
}