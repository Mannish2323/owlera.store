import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://wlsqkfqrpoxpvchiokdu.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsc3FrZnFycG94cHZjaGlva2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzQxMzUsImV4cCI6MjEwODc1MDEzNX0.REcdGn0CFGZL34d0wUR0B2OxujESNF0ZU6ypyxft39A";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return createBrowserClient(url, key);
}
