import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AuthUser } from "@/hooks/useAuth";
import { getHubSession } from "@/lib/server/hubSession";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable.");
}

type ProxyMethod = "GET" | "POST" | "PUT" | "DELETE";

type ProxyInput = {
  endpoint: string;
  method?: ProxyMethod;
  body?: unknown;
};

const proxyInputSchema = z.object({
  endpoint: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional(),
  body: z.unknown().optional(),
});

function parseBody(body: RequestInit["body"]) {
  if (!body) return undefined;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  return body;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function normalizeEndpoint(endpoint: string) {
  if (!endpoint) {
    throw new Error("Missing hub API endpoint.");
  }

  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function isPathMatch(pathname: string, pattern: RegExp) {
  return pattern.test(pathname);
}

function ensureAdminScope(user: AuthUser, url: URL, method: ProxyMethod, body: unknown) {
  if (user.role === "super_admin") {
    return body;
  }

  if (user.role !== "admin" || !user.schoolId) {
    throw new Error("Unauthorized hub API access.");
  }

  const pathname = url.pathname;
  const scopedQueryKeys = new Set(["schoolId"]);

  if (isPathMatch(pathname, /^\/schools\/dashboard-summary\/[^/]+$/)) {
    const requestedSchoolId = pathname.split("/").pop() || "";
    if (requestedSchoolId !== user.schoolId) {
      throw new Error("You can only access data for your assigned school.");
    }
    return body;
  }

  for (const key of scopedQueryKeys) {
    const requestedValue = url.searchParams.get(key);
    if (requestedValue && requestedValue !== user.schoolId) {
      throw new Error("You can only access data for your assigned school.");
    }
    if (!requestedValue && method === "GET" && pathname !== "/auth/users") {
      url.searchParams.set(key, user.schoolId);
    }
  }

  if (body && typeof body === "object" && !Array.isArray(body)) {
    const nextBody = { ...(body as Record<string, unknown>) };
    if ("schoolId" in nextBody && nextBody.schoolId && nextBody.schoolId !== user.schoolId) {
      throw new Error("You can only modify data for your assigned school.");
    }
    nextBody.schoolId = user.schoolId;
    return nextBody;
  }

  return body;
}

function assertAllowedEndpoint(user: AuthUser, url: URL, method: ProxyMethod) {
  const pathname = url.pathname;

  if (pathname === "/auth/users" && method === "GET") {
    if (user.role !== "super_admin") {
      throw new Error("Only super admins can access platform user data.");
    }
    return;
  }

  const adminPatterns: Array<{ pattern: RegExp; methods: ProxyMethod[] }> = [
    { pattern: /^\/schools\/dashboard-summary\/[^/]+$/, methods: ["GET"] },
    { pattern: /^\/students$/, methods: ["GET", "POST"] },
    { pattern: /^\/students\/bulk$/, methods: ["POST"] },
    { pattern: /^\/students\/toggle$/, methods: ["POST"] },
    { pattern: /^\/students\/[^/]+$/, methods: ["PUT"] },
    { pattern: /^\/teachers$/, methods: ["GET", "POST"] },
    { pattern: /^\/teachers\/[^/]+$/, methods: ["PUT", "DELETE"] },
    { pattern: /^\/classes$/, methods: ["GET", "POST"] },
    { pattern: /^\/classes\/[^/]+$/, methods: ["PUT", "DELETE"] },
    { pattern: /^\/fees$/, methods: ["GET", "POST"] },
    { pattern: /^\/fees\/templates$/, methods: ["GET", "POST"] },
    { pattern: /^\/fees\/templates\/[^/]+$/, methods: ["PUT"] },
    { pattern: /^\/fees\/templates\/[^/]+\/assign$/, methods: ["POST"] },
    { pattern: /^\/fees\/[^/]+$/, methods: ["PUT"] },
    { pattern: /^\/fees\/[^/]+\/payments$/, methods: ["POST"] },
  ];

  const allowed = adminPatterns.some(
    ({ pattern, methods }) => methods.includes(method) && isPathMatch(pathname, pattern)
  );

  if (!allowed) {
    throw new Error("This API is not exposed through the School Connect hub.");
  }

  if (!["admin", "super_admin"].includes(user.role || "")) {
    throw new Error("Only admin and super admin users can access hub APIs.");
  }
}

export const hubApiProxy = createServerFn({ method: "POST" })
  .inputValidator(proxyInputSchema)
  .handler(async ({ data }) => {
    const endpoint = normalizeEndpoint(data.endpoint);
    const method = (data.method || "GET").toUpperCase() as ProxyMethod;
    const session = await getHubSession();
    const user = session.data.user || null;
    const accessToken = session.data.accessToken;

    if (!user || !accessToken) {
      throw new Error("Please login again to continue.");
    }

    const url = new URL(endpoint, API_URL);
    assertAllowedEndpoint(user, url, method);
    const scopedBody = ensureAdminScope(user, url, method, data.body);

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(scopedBody instanceof FormData ? {} : { "Content-Type": "application/json" }),
      },
      body:
        method === "GET" || scopedBody == null
          ? undefined
          : scopedBody instanceof FormData
            ? scopedBody
            : JSON.stringify(scopedBody),
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null
          ? (payload as { message?: string }).message || JSON.stringify(payload)
          : String(payload || response.statusText || "Hub API request failed");
      throw new Error(message);
    }

    return payload;
  });

export function toProxyInput(endpoint: string, options: RequestInit = {}): ProxyInput {
  return {
    endpoint,
    method: ((options.method || "GET").toUpperCase() as ProxyMethod) || "GET",
    body: parseBody(options.body),
  };
}
