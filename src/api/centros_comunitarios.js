import { API_URL_CENTROS_COMUNITARIOS } from "@env";
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

export async function fetchCentros_comunitarios(params = {}) {
  const query = buildQueryString(params);
  const result = await authorizedRequest(
    `${API_URL_CENTROS_COMUNITARIOS}${query}`,
    {
      method: "GET",
    }
  );

  return (
    assertSuccess(result, "Error al obtener centros comunitarios").data ?? {
      items: [],
      pagination: null,
    }
  );
}

export async function crearCentro(payload) {
  const result = await authorizedRequest(API_URL_CENTROS_COMUNITARIOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return assertSuccess(result, "No se pudo crear el centro comunitario").data;
}

export async function actualizarCentro(id, payload) {
  if (id == null) throw new Error("ID requerido");

  const result = await authorizedRequest(
    `${API_URL_CENTROS_COMUNITARIOS}/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return assertSuccess(result, "No se pudo actualizar el centro comunitario")
    .data;
}

export async function eliminarCentro(id) {
  if (id == null) throw new Error("ID requerido");

  const result = await authorizedRequest(
    `${API_URL_CENTROS_COMUNITARIOS}/${id}`,
    {
      method: "DELETE",
    }
  );

  return assertSuccess(result, "No se pudo eliminar el centro comunitario")
    .message;
}

export async function obtenerCentroLocal(id) {
  if (id == null) throw new Error("ID requerido");

  const result = await authorizedRequest(
    `${API_URL_CENTROS_COMUNITARIOS}/${id}`,
    {
      method: "GET",
    }
  );

  return assertSuccess(result, "No se pudo obtener el centro indicado").data;
}
