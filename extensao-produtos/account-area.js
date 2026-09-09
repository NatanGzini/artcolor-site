import { SUPABASE_CONFIG, isSupabaseConfigured } from "./supabase-config.js";

const SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const internalRoles = new Set(["staff", "admin", "developer"]);
const roleLabels = {
  customer: "Cliente",
  staff: "Equipe",
  admin: "Administrador",
  developer: "Desenvolvedor",
};

let supabaseClientPromise = null;

function setStatus(message, type = "info") {
  const status = document.querySelector("[data-account-status]");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.status = type;
}

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClientPromise) {
    supabaseClientPromise = import(SUPABASE_SDK_URL).then(({ createClient }) =>
      createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    );
  }

  return supabaseClientPromise;
}

function renderProfile(user, profile) {
  const nameTarget = document.querySelector("[data-profile-name]");
  const emailTarget = document.querySelector("[data-profile-email]");
  const roleTarget = document.querySelector("[data-profile-role]");
  const role = profile?.role || "customer";

  if (nameTarget) {
    nameTarget.textContent = profile?.full_name || user.email || "Conta Artcolor";
  }

  if (emailTarget) {
    emailTarget.textContent = user.email || "";
  }

  if (roleTarget) {
    roleTarget.textContent = roleLabels[role] || "Cliente";
  }
}

function shouldRedirect(role) {
  const pageRole = document.body.dataset.requiredRole;

  if (pageRole === "internal") {
    return !internalRoles.has(role);
  }

  if (pageRole === "customer") {
    return internalRoles.has(role);
  }

  return false;
}

async function bootAccountArea() {
  if (!isSupabaseConfigured()) {
    setStatus("Área temporariamente indisponível.", "warning");
    return;
  }

  const supabase = await getSupabaseClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user) {
    window.location.replace("login.html");
    return;
  }

  const user = sessionData.session.user;
  const [{ data: profile, error: profileError }, { data: role, error: roleError }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, company_name, city, role")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.rpc("current_profile_role"),
  ]);

  if (profileError || roleError) {
    setStatus("Não foi possível carregar sua área agora.", "error");
    return;
  }

  const effectiveProfile = { ...profile, role: role || profile?.role || "customer" };
  const accountRole = effectiveProfile.role;

  if (shouldRedirect(accountRole)) {
    window.location.replace(internalRoles.has(accountRole) ? "painel-interno.html" : "area-cliente.html");
    return;
  }

  renderProfile(user, effectiveProfile);
  setStatus("Acesso confirmado.", "success");
}

document.querySelector("[data-sign-out]")?.addEventListener("click", async () => {
  const supabase = await getSupabaseClient();
  await supabase?.auth.signOut();
  window.location.replace("login.html");
});

bootAccountArea();
