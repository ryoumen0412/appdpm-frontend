// MiAppExpo/src/utils/permisos.js

// Constantes de nivel para mantener consistencia con el backend (ver app/models.py)
export const NIVEL_APOYO = 1; // Acceso básico (apoyo)
export const NIVEL_ENCARGADO = 2; // Encargado / coordinador
export const NIVEL_ADMIN = 3; // Administrador total

// Mapa de acciones a niveles permitidos (ajusta a tu lógica de negocio)
export const REGLAS_ACCIONES = {
  crear_persona: [NIVEL_ADMIN],
  editar_persona: [NIVEL_ENCARGADO, NIVEL_ADMIN],
  borrar_persona: [NIVEL_ADMIN],

  crear_trabajador: [NIVEL_ENCARGADO, NIVEL_ADMIN],
  editar_trabajador: [NIVEL_ENCARGADO, NIVEL_ADMIN],
  borrar_trabajador: [NIVEL_ADMIN],

  crear_centro: [NIVEL_ENCARGADO, NIVEL_ADMIN],
  editar_centro: [NIVEL_ENCARGADO, NIVEL_ADMIN],
  borrar_centro: [NIVEL_ADMIN],

  // Acciones genéricas
  ver_listas: [NIVEL_APOYO, NIVEL_ENCARGADO, NIVEL_ADMIN],
};

/**
 * NOTAS DE EXTENSIÓN DE PERMISOS
 * -----------------------------------------------------
 * Cómo agregar una nueva acción:
 * 1. Define la clave de acción aquí en REGLAS_ACCIONES (ej: 'exportar_reporte').
 * 2. Asigna un array con los niveles que pueden realizarla. Recuerda: nivel 1 = mayor privilegio.
 * 3. En el componente (screen o tabla), importa { puede } y llama: puede(usuario,'exportar_reporte').
 * 4. Si necesitas agrupar acciones similares (ej: 'crear_*'), puedes crear helpers específicos o usar un prefijo.
 *
 * Convención de nombres de acciones:
 *  - crear_entidad (crear_persona, crear_trabajador, crear_centro)
 *  - editar_entidad
 *  - borrar_entidad
 *  - ver_listas (acción genérica de lectura)
 *  - Otras futuras: asignar_rol, resetear_password, exportar_datos
 *
 * Jerarquía de niveles (actual asumida):
 *  - 1: Administrador total
 *  - 2: Supervisor / Coordinador con permisos de edición
 *  - 3+: Lectura / roles restringidos
 *  Ajusta esta semántica en documentación formal si cambia.
 *
 * Buenas prácticas:
 *  - Evita comparar directamente usuario.nivel en componentes; centraliza aquí.
 *  - Si una acción no está definida en REGLAS_ACCIONES, se deniega por defecto.
 *  - Para auditoría futura, podrías registrar cada chequeo de permisos añadiendo logging en la función puede().
 */

function extraerNivel(usuario) {
  if (!usuario) return null;
  if (typeof usuario === "object") return usuario.nivel ?? null;
  return null;
}

export function tieneNivel(usuario) {
  return extraerNivel(usuario) != null;
}

// Verifica si el nivel del usuario está en la lista de la acción
export function puede(usuario, accion) {
  const nivel = extraerNivel(usuario);
  if (nivel == null) return false;
  const permitidos = REGLAS_ACCIONES[accion];
  if (!permitidos) return false; // Acción no definida => negar
  return permitidos.includes(nivel);
}

// Verifica si el nivel del usuario es >= mínimo
export function puedeAlMenos(usuario, nivelMin) {
  const nivel = extraerNivel(usuario);
  return nivel != null && nivel >= nivelMin;
}

// Helper para debugear
export function describirUsuario(usuario) {
  if (!usuario) return "(sin usuario)";
  if (typeof usuario === "object") {
    return `rut=${usuario.rut} nivel=${usuario.nivel} nombre=${
      usuario.nombre || "-"
    }`;
  }
  return `(usuario texto) ${usuario}`;
}
