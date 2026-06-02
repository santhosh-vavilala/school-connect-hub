import { getCachedAccessToken } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable.");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const accessToken = getCachedAccessToken();
  const requestUrl = `${API_URL}${normalizedEndpoint}`;
  console.log("[apiFetch] preparing request", {
    endpoint: normalizedEndpoint,
    requestUrl,
    method: options.method || "GET",
    hasAccessToken: Boolean(accessToken),
  });

  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    console.log("[apiFetch] sending request", { requestUrl });
    response = await fetch(requestUrl, {
      ...options,
      headers,
    });
    console.log("[apiFetch] received response", {
      requestUrl,
      status: response.status,
      ok: response.ok,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || "Unknown network error");
    console.error("[apiFetch] network failure", {
      requestUrl,
      message,
    });
    throw new Error(`Unable to reach backend at ${requestUrl}. ${message}`);
  }

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

export async function publicApiFetch(endpoint: string, options: RequestInit = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const requestUrl = `${API_URL}${normalizedEndpoint}`;
  console.log("[publicApiFetch] preparing request", {
    endpoint: normalizedEndpoint,
    requestUrl,
    method: options.method || "GET",
  });

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    console.log("[publicApiFetch] sending request", { requestUrl });
    response = await fetch(requestUrl, {
      ...options,
      headers,
    });
    console.log("[publicApiFetch] received response", {
      requestUrl,
      status: response.status,
      ok: response.ok,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || "Unknown network error");
    console.error("[publicApiFetch] network failure", {
      requestUrl,
      message,
    });
    throw new Error(`Unable to reach backend at ${requestUrl}. ${message}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? (data as any).message || JSON.stringify(data)
        : String(data || response.statusText || "API request failed");
    throw new Error(message);
  }

  return data;
}
