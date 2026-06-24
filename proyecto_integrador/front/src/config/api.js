/** Base URL del API (vacío = mismo origen; Vite reenvía /api al backend). */
export const apiBase = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${p}`;
}
