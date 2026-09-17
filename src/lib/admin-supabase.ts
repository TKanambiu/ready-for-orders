// Standalone Supabase client for the admin dashboard.
//
// The shared client (src/integrations/supabase/client.ts) stores its session
// through a postMessage broker that only answers inside the Lovable editor.
// On a plain static host (or when the broker never replies) every auth call
// waits on that round-trip, which is what made the old admin page freeze.
// This client always uses localStorage and puts a hard timeout on every
// network call, so the dashboard works on any host.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://rixnjglaqyoqdchevppv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeG5qZ2xhcXlvcWRjaGV2cHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTIxMzAsImV4cCI6MjA5OTQyODEzMH0.SR38u3xC_U1V78ROnG14XfdIgGb2iN9Y-YErPfWWNTU";

const REQUEST_TIMEOUT_MS = 20_000;

const timeoutFetch: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const signal = init?.signal;
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

export const adminSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window === "undefined" ? undefined : window.localStorage,
    storageKey: "zentramed-admin-auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: { fetch: timeoutFetch },
});

/** Never let a promise hang the UI forever. */
export function withTimeout<T>(promise: PromiseLike<T>, ms = REQUEST_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("The server took too long to respond. Please try again.")), ms),
    ),
  ]);
}
