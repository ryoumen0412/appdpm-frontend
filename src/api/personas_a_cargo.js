import { API_URL_PERSONAS_A_CARGO } from "@env";
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

export async function fetchPersonas_a_cargo(params = {}) {
  const query = buildQueryString(params);
  const result = await authorizedRequest(
    `${API_URL_PERSONAS_A_CARGO}${query}`,
    {
      method: "GET",
    }
  );

  return (
    assertSuccess(result, "Error al obtener personas a cargo").data ?? {
      items: [],
      pagination: null,
    }
  );
}

export async function crearPersona(payload) {
  const result = await authorizedRequest(API_URL_PERSONAS_A_CARGO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return assertSuccess(result, "No se pudo crear la persona a cargo").data;
}

export async function actualizarPersona(rut, payload) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_PERSONAS_A_CARGO}/${encodeURIComponent(rut)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return assertSuccess(result, "No se pudo actualizar la persona a cargo").data;
}

export async function eliminarPersona(rut) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_PERSONAS_A_CARGO}/${encodeURIComponent(rut)}`,
    {
      method: "DELETE",
    }
  );

  return assertSuccess(result, "No se pudo eliminar la persona a cargo")
    .message;
}

export async function obtenerPersonaLocal(rut) {
  if (!rut) throw new Error("RUT requerido");

  const result = await authorizedRequest(
    `${API_URL_PERSONAS_A_CARGO}/${encodeURIComponent(rut)}`,
    {
      method: "GET",
    }
  );

  return assertSuccess(result, "No se pudo obtener la persona seleccionada")
    .data;
}
