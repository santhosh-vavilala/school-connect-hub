import { getSupabaseClient } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable.");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const supabase = getSupabaseClient();
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;

  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? (data as any).message || JSON.stringify(data)
        : String(data || response.statusText || "API request failed");
    const error = new Error(message);
    throw error;
  }

  return data;
}
