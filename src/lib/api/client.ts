// Cliente HTTP cableado para enchufar la API real más adelante.
// Mientras VITE_API_BASE_URL esté vacío o el request falle, se usa el fallback provisto.

const baseURL = (import.meta.env.VITE_API_BASE_URL ?? "").toString().trim();

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  if (!baseURL) return fallback;
  try {
    const res = await fetch(`${baseURL.replace(/\/$/, "")}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}