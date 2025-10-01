import { obtenerToken, borrarToken } from "./session";

async function safeJson(res) {
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
}

function extractResult(res, payload) {
  const success = res.ok && payload?.success !== false;
  return {
    success,
    status: res.status,
    data: payload?.data ?? null,
    message: payload?.message ?? payload?.data?.message ?? null,
    error: success
      ? null
      : payload?.error || payload?.message || `Error HTTP ${res.status}`,
    raw: payload,
  };
}

export async function apiRequest(url, options = {}) {
  console.log("[HTTP] Making request to:", url);
  console.log("[HTTP] Options:", JSON.stringify(options, null, 2));

  try {
    const res = await fetch(url, options);
    console.log("[HTTP] Response received:", {
      status: res.status,
      ok: res.ok,
      statusText: res.statusText,
    });

    const payload = await safeJson(res);
    console.log("[HTTP] Payload parsed:", payload);

    const result = extractResult(res, payload);
    console.log("[HTTP] Final result:", {
      success: result.success,
      status: result.status,
      hasData: !!result.data,
      error: result.error,
    });

    return result;
  } catch (error) {
    console.error("[HTTP] Request failed with exception:", error);
    console.error("[HTTP] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return {
      success: false,
      status: null,
      data: null,
      message: null,
      error: "No se pudo conectar al servidor",
      raw: null,
    };
  }
}

export async function authorizedRequest(url, options = {}, config = {}) {
  const {
    requireToken = true,
    clearOn401 = true,
    clearOnFinish = false,
  } = config;

  const token = await obtenerToken();

  if (!token) {
    if (requireToken) {
      return {
        success: false,
        status: null,
        data: null,
        message: null,
        error: "No hay token",
        raw: null,
      };
    }

    if (clearOnFinish) {
      await borrarToken();
    }

    return {
      success: true,
      status: null,
      data: null,
      message: null,
      error: null,
      raw: null,
    };
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const result = await apiRequest(url, {
    ...options,
    headers,
  });

  if (!result.success && result.status === 401 && clearOn401) {
    await borrarToken();
  }

  if (clearOnFinish) {
    await borrarToken();
  }

  return result;
}
