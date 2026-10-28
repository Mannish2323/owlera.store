import { createClient } from "@/lib/supabase-server";

/**
 * Verifies that the current request is from an authenticated admin user.
 * Checks both: 1) valid Supabase Auth session, and 2) user exists in admin_users table.
 *
 * Returns { authorized: true, userId, email } on success,
 * or { authorized: false, error, status } on failure.
 */
export async function verifyAdmin(): Promise<
  | { authorized: true; userId: string; email: string }
  | { authorized: false; error: string; status: number }
> {
  const supabase = createClient();

  if (!supabase) {
    return {
      authorized: false,
      error: "Database not configured. Cannot verify admin credentials.",
      status: 503,
    };
  }

  // 1. Check for authenticated session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      authorized: false,
      error: "Authentication required. Please sign in.",
      status: 401,
    };
  }

  // 2. Verify user is in admin_users table
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (adminError || !adminRecord) {
    // Also check profiles table for role = 'admin' as a fallback
    const { data: profileRecord } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profileRecord || profileRecord.role !== "admin") {
      return {
        authorized: false,
        error: "Insufficient permissions. Admin access required.",
        status: 403,
      };
    }
  }

  return {
    authorized: true,
    userId: user.id,
    email: user.email || "",
  };
}

/**
 * Creates a Supabase admin client using the service role key.
 * Only use on the server for operations that need to bypass RLS
 * (e.g., stock decrements after payment verification).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  // Dynamic import to avoid bundling on client
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(url, serviceKey);
}
