import { API_URL_LOGIN, API_URL_PROFILE, API_URL_LOGOUT } from "@env";
import { apiRequest, authorizedRequest } from "./http";

export { guardarToken, obtenerToken, borrarToken } from "./session";

const API_LOGIN = API_URL_LOGIN;
const API_PROFILE = API_URL_PROFILE;
const API_LOGOUT = API_URL_LOGOUT;

// Debug logging
console.log("[AUTH] Environment variables loaded:");
console.log("[AUTH] API_LOGIN =", API_LOGIN);
console.log("[AUTH] API_PROFILE =", API_PROFILE);
console.log("[AUTH] API_LOGOUT =", API_LOGOUT);

export async function login(rut_usr, password) {
  console.log("[AUTH] Attempting login with RUT:", rut_usr);
  console.log("[AUTH] Using endpoint:", API_LOGIN);

  const result = await apiRequest(API_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut_usuario: rut_usr, password }),
  });

  console.log("[AUTH] Login result:", {
    success: result.success,
    status: result.status,
    hasToken: !!result.data?.token,
    error: result.error,
  });

  return result;
}

export async function verificarToken() {
  return authorizedRequest(API_PROFILE, {
    method: "GET",
  });
}

export async function logout() {
  const result = await authorizedRequest(
    API_LOGOUT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      requireToken: false,
      clearOnFinish: true,
    }
  );
  return result;
}
