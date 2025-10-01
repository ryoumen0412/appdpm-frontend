import { API_URL_TRABAJADORES_APOYO } from "@env";
import { authorizedRequest } from "./http";

function assertSuccess(result, fallbackMessage) {
  if (!result.success) {
    throw new Error(result.error || fallbackMessage);
  }
  return result;
}

function buildQueryString(params = {}) {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  if (entries.length === 0) return "";
  const searchParams = new URLSearchParams(entries);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchTrabajadores_apoyo(params = {}) {
  const query = buildQueryString(params);
  const result = await authorizedRequest(
    `${API_URL_TRABAJADORES_APOYO}${query}`,
    {
      method: "GET",
    }
  );

  return (
    assertSuccess(result, "Error al obtener trabajadores de apoyo").data ?? {
      items: [],
      pagination: null,
    }
  );
}

export async function crearTrabajadorApoyo(payload) {
  const result = await authorizedRequest(API_URL_TRABAJADORES_APOYO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return assertSuccess(result, "No se pudo crear el trabajador de apoyo").data;
}

export async function actualizarTrabajadorApoyo(rut, payload) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_TRABAJADORES_APOYO}/${encodeURIComponent(rut)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return assertSuccess(result, "No se pudo actualizar el trabajador de apoyo")
    .data;
}

export async function eliminarTrabajadorApoyo(rut) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_TRABAJADORES_APOYO}/${encodeURIComponent(rut)}`,
    {
      method: "DELETE",
    }
  );

  return assertSuccess(result, "No se pudo eliminar el trabajador de apoyo")
    .message;
}

export async function obtenerTrabajadorApoyoLocal(rut) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_TRABAJADORES_APOYO}/${encodeURIComponent(rut)}`,
    {
      method: "GET",
    }
  );

  return assertSuccess(result, "No se pudo obtener el trabajador de apoyo")
    .data;
}
