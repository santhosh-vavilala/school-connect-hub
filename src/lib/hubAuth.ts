import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AuthUser } from "@/hooks/useAuth";
import { getHubSession } from "@/lib/server/hubSession";

const API_URL = import.meta.env.VITE_API_URL as string;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable.");
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

function normalizePhone(phone?: string | null) {
  if (!phone) return null;
  return phone.replace("+91", "").replace(/\D/g, "");
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

async function fetchSupabasePhone(accessToken: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await parseResponse(response);
  if (!response.ok || !payload || typeof payload !== "object") {
    throw new Error("Unable to validate the current login session.");
  }

  const phone = normalizePhone((payload as { phone?: string | null }).phone);
  if (!phone) {
    throw new Error("Phone number missing from the current login session.");
  }

  return phone;
}

async function resolveHubUser(phone: string, accessToken: string): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/auth/user?phone=${encodeURIComponent(phone)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null
        ? (payload as { message?: string }).message || JSON.stringify(payload)
        : String(payload || response.statusText || "Unable to resolve user.");
    throw new Error(message);
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const userPayload = payload as Record<string, unknown>;

  return {
    role: (userPayload.role as AuthUser["role"]) || null,
    schoolId: (userPayload.schoolId as string | null) || null,
    userId: (userPayload.userId as string | null) || null,
    name: (userPayload.name as string | null) || null,
    phone,
    isActive: userPayload.isActive !== false,
    schoolEnabled: userPayload.schoolEnabled !== false,
  };
}

function assertDashboardAccess(user: AuthUser | null) {
  if (!user) {
    throw new Error("User not found. This phone number is not registered in School Connect.");
  }
  if (!user.isActive) {
    throw new Error("Your account has been disabled. Please contact the school.");
  }
  if (!user.schoolEnabled) {
    throw new Error("Unable to login because the school account is inactive.");
  }
  if (!["admin", "super_admin"].includes(user.role || "")) {
    throw new Error("Only admin and super admin users can access the School Connect dashboard.");
  }
}

export const establishHubSession = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken } = data;

    const phone = await fetchSupabasePhone(accessToken);
    const user = await resolveHubUser(phone, accessToken);
    assertDashboardAccess(user);

    const session = await getHubSession();
    await session.update({
      accessToken,
      user,
    });

    return user;
  });

export const getHubSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getHubSession();
  const accessToken = session.data.accessToken;
  const cachedUser = session.data.user || null;

  if (!accessToken || !cachedUser) {
    return null;
  }

  const phone = normalizePhone(cachedUser.phone);
  if (!phone) {
    await session.clear();
    return null;
  }

  const user = await resolveHubUser(phone, accessToken);
  assertDashboardAccess(user);

  await session.update({
    accessToken,
    user,
  });

  return user;
});

export const clearHubSession = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getHubSession();
  await session.clear();
  return { ok: true };
});
