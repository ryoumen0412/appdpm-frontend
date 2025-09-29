import { API_URL_TRABAJADORES_APOYO } from '@env';

export async function fetchTrabajadores_apoyo() {
  try {
    const response = await fetch(API_URL_TRABAJADORES_APOYO);
    if (!response.ok) throw new Error('Error al obtener datos');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// -----------------------------
// Helpers CRUD adicionales
// -----------------------------

// Manejo de respuesta estándar
async function handleResponse(res) {
  let body = null;
  try { body = await res.json(); } catch {/* ignore */}
  if (!res.ok) {
    const msg = body?.error || body?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export async function crearTrabajadorApoyo(payload, token) {
  const res = await fetch(API_URL_TRABAJADORES_APOYO, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function actualizarTrabajadorApoyo(rut, payload, token) {
  if (!rut) throw new Error('RUT requerido');
  const res = await fetch(`${API_URL_TRABAJADORES_APOYO}/${encodeURIComponent(rut)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function eliminarTrabajadorApoyo(rut, token) {
  if (!rut) throw new Error('RUT requerido');
  const res = await fetch(`${API_URL_TRABAJADORES_APOYO}/${encodeURIComponent(rut)}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
  return handleResponse(res);
}

// Local fallback (hasta tener endpoint GET /trabajadores_apoyo/<rut>)
export async function obtenerTrabajadorApoyoLocal(rut) {
  const list = await fetchTrabajadores_apoyo();
  return list.find(t => t.rut === rut) || null;
}