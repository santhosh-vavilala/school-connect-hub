import { useSession } from "@tanstack/react-start/server";
import type { AuthUser } from "@/hooks/useAuth";

export interface HubSessionData {
  accessToken?: string;
  user?: AuthUser | null;
}

const SESSION_NAME = "school-connect-hub-session";
const DEFAULT_SESSION_SECRET = "school-connect-hub-dev-session-secret-change-me";

function getSessionPassword() {
  return (
    process.env.HUB_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    DEFAULT_SESSION_SECRET
  );
}

export function getHubSession() {
  return useSession<HubSessionData>({
    name: SESSION_NAME,
    password: getSessionPassword(),
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  });
}
