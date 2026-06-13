import { hubApiProxy, toProxyInput } from "./hubApiProxy";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return hubApiProxy({
    data: toProxyInput(endpoint, options),
  });
}
