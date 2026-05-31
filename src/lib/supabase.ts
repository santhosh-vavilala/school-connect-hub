import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

const isServer = import.meta.env.SSR || typeof window === "undefined";
const storage = !isServer ? window.localStorage : undefined;

export const supabase = isServer
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage,
      },
    });

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error("Supabase client is only available in the browser.");
  }

  return supabase;
}
