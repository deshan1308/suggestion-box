import { createClient } from "@/utils/supabase/server";

/** SSR Supabase client (cookies + auth refresh via proxy). */
export async function getSupabaseServerClient() {
  return createClient();
}
