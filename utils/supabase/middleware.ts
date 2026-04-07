import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let url: string;
  let anonKey: string;
  try {
    ({ url, anonKey } = getSupabaseEnv());
  } catch {
    // Fail-safe in production: if env vars are missing, do not crash all routes.
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // Ignore auth refresh errors here; route handlers/pages handle auth-specific failures.
  }

  return supabaseResponse;
}
