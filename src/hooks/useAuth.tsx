import * as React from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";

export type AuthRole =
  | "super_admin"
  | "admin"
  | "teacher"
  | "parent"
  | null;

export interface AuthUser {
  role: AuthRole;
  schoolId: string | null;
  userId: string | null;
  name: string | null;
  phone: string | null;
  isActive: boolean;
  schoolEnabled: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  otpRequestedFor: string;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resetOtpFlow: () => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function normalizePhone(phone?: string | null) {
  if (!phone) return null;
  return phone.replace("+91", "").replace(/\D/g, "");
}

async function resolveUser(phone: string): Promise<AuthUser | null> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return null;
  }

  const payload = (await apiFetch(`/auth/user?phone=${normalizedPhone}`)) as any;

  return {
    role: payload.role,
    schoolId: payload.schoolId || null,
    userId: payload.userId || null,
    name: payload.name || null,
    phone: normalizedPhone,
    isActive: payload.isActive !== false,
    schoolEnabled: payload.schoolEnabled !== false,
  };
}

function getAuthErrorMessage(error: unknown, flow: "sendOtp" | "verifyOtp") {
  const message = error instanceof Error ? error.message : String(error || "");
  const normalizedMessage = message.toLowerCase();

  if (flow === "sendOtp") {
    if (normalizedMessage.includes("phone") && normalizedMessage.includes("invalid")) {
      return "Please enter a valid 10-digit phone number.";
    }
    if (normalizedMessage.includes("rate limit")) {
      return "Too many attempts. Please try again later.";
    }
    if (normalizedMessage.includes("sms")) {
      return "Unable to send OTP right now. Please try again shortly.";
    }
    if (normalizedMessage.includes("network")) {
      return "Network error. Please check your connection.";
    }
    return "Unable to send OTP. Please try again.";
  }

  if (normalizedMessage.includes("user not found")) {
    return "User not found. This phone number is not registered in School Connect.";
  }
  if (normalizedMessage.includes("token") && normalizedMessage.includes("invalid")) {
    return "Invalid OTP. Please enter the correct OTP.";
  }
  if (normalizedMessage.includes("expired")) {
    return "OTP expired. Please request a new OTP.";
  }
  if (
    normalizedMessage.includes("network request failed") ||
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("network")
  ) {
    return "Network error. Please check your connection.";
  }

  return "Unable to verify OTP. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [otpRequestedFor, setOtpRequestedFor] = React.useState("");

  React.useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const supabase = getSupabaseClient();

    const loadSessionUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const phone = data.session?.user?.phone;
        if (phone) {
          const resolved = await resolveUser(phone);
          if (mounted) {
            setUser(resolved);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadSessionUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session?.user?.phone) {
        setUser(null);
        setOtpRequestedFor("");
        return;
      }
      const resolved = await resolveUser(session.user.phone);
      setUser(resolved);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const refreshUser = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    const phone = data.session?.user?.phone;
    if (phone) {
      const resolved = await resolveUser(phone);
      setUser(resolved);
    } else {
      setUser(null);
    }
  }, []);

  const sendOtp = React.useCallback(async (phone: string) => {
    const supabase = getSupabaseClient();
    const cleanedPhone = phone.replace(/\D/g, "").trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      throw new Error("Please enter a valid 10-digit phone number.");
    }

    const fullPhone = `+91${cleanedPhone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) {
      throw new Error(getAuthErrorMessage(error, "sendOtp"));
    }

    setOtpRequestedFor(fullPhone);
  }, []);

  const verifyOtp = React.useCallback(
    async (code: string) => {
      const supabase = getSupabaseClient();
      if (!otpRequestedFor) {
        throw new Error("Please request OTP first.");
      }

      const trimmedCode = code.trim();
      if (!/^\d{6}$/.test(trimmedCode)) {
        throw new Error("Please enter a valid 6-digit OTP.");
      }

      const { data, error } = await supabase.auth.verifyOtp({
        phone: otpRequestedFor,
        token: trimmedCode,
        type: "sms",
      });

      if (error) {
        throw new Error(getAuthErrorMessage(error, "verifyOtp"));
      }

      const phone = data.user?.phone || otpRequestedFor;
      const resolved = await resolveUser(phone);
      if (!resolved) {
        throw new Error("User not found. This phone number is not registered in School Connect.");
      }
      if (!resolved.isActive) {
        throw new Error("Your account has been disabled. Please contact the school.");
      }
      if (!resolved.schoolEnabled) {
        throw new Error("Unable to login because the school account is inactive.");
      }

      setUser(resolved);
      setOtpRequestedFor("");
    },
    [otpRequestedFor]
  );

  const signOut = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setOtpRequestedFor("");
  }, []);

  const resetOtpFlow = React.useCallback(() => {
    setOtpRequestedFor("");
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      otpRequestedFor,
      sendOtp,
      verifyOtp,
      resetOtpFlow,
      signOut,
      refreshUser,
    }),
    [isLoading, otpRequestedFor, sendOtp, signOut, user, verifyOtp, refreshUser, resetOtpFlow]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
