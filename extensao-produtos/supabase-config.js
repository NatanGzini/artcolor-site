export const SUPABASE_CONFIG = {
  url: "https://dyadsllgoqnxvtzvqkgu.supabase.co",
  anonKey: "sb_publishable_rjy97l0UGuenfd1A7gNhpQ_oBKWb-pP",
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}
