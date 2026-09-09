import { SUPABASE_CONFIG, isSupabaseConfigured } from "./supabase-config.js";

const SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const internalRoles = new Set(["staff", "admin", "developer"]);
const roleLabels = {
  customer: "Cliente",
  staff: "Equipe",
  admin: "Administrador",
  developer: "Desenvolvedor",
};

const loginLinks = document.querySelectorAll('a[href="login.html"]');
const accountMenu = document.querySelector("[data-account-menu]");
const accountToggle = document.querySelector("[data-account-toggle]");
const accountDropdown = document.querySelector("[data-account-dropdown]");
const accountInitial = document.querySelector("[data-account-initial]");
const accountName = document.querySelector("[data-account-name]");
const accountEmail = document.querySelector("[data-account-email]");
const accountAreaLink = document.querySelector("[data-account-area-link]");
const accountStatus = document.querySelector("[data-account-menu-status]");
const settingsModal = document.querySelector("#accountSettingsModal");
let supabaseClientPromise = null;
let currentAccount = null;

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

function setMenuOpen(isOpen) {
  accountMenu?.classList.toggle("is-open", isOpen);
  accountToggle?.setAttribute("aria-expanded", String(isOpen));
}

function getAreaByRole(role) {
  return internalRoles.has(role) ? "painel-interno.html" : "area-cliente.html";
}

function getInitial(name, email) {
  return (name || email || "U").trim().charAt(0).toUpperCase();
}

function setStatus(message, type = "info") {
  if (!accountStatus) {
    return;
  }

  accountStatus.textContent = message;
  accountStatus.dataset.status = type;
}

function openSettings() {
  if (!currentAccount || !settingsModal) {
    return;
  }

  document.querySelector("[data-settings-email]").textContent = currentAccount.email || "Não informado";
  document.querySelector("[data-settings-phone]").textContent = currentAccount.phone || "Não informado";
  document.querySelector("[data-settings-role]").textContent = roleLabels[currentAccount.role] || "Cliente";
  settingsModal.classList.add("is-visible");
  settingsModal.setAttribute("aria-hidden", "false");
  setMenuOpen(false);
}

function closeSettings() {
  settingsModal?.classList.remove("is-visible");
  settingsModal?.setAttribute("aria-hidden", "true");
}

function renderLoggedOut() {
  loginLinks.forEach((link) => link.removeAttribute("hidden"));
  accountMenu?.setAttribute("hidden", "");
  currentAccount = null;
}

function renderLoggedIn(user, profile, role) {
  const fullName = profile?.full_name || "Conta Artcolor";
  const email = user.email || "";
  const phone = profile?.phone || "";
  const accountRole = role || profile?.role || "customer";

  currentAccount = { email, phone, role: accountRole };
  loginLinks.forEach((link) => link.setAttribute("hidden", ""));
  accountMenu?.removeAttribute("hidden");
  accountInitial.textContent = getInitial(fullName, email);
  accountName.textContent = fullName;
  accountEmail.textContent = email;
  accountAreaLink.href = getAreaByRole(accountRole);
}

async function loadAccount() {
  if (!accountMenu || !isSupabaseConfigured()) {
    return;
  }

  const supabase = await getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    renderLoggedOut();
    return;
  }

  const [{ data: profile }, { data: role }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.rpc("current_profile_role"),
  ]);

  renderLoggedIn(user, profile, role);
}

accountToggle?.addEventListener("click", () => {
  setMenuOpen(!accountMenu.classList.contains("is-open"));
});

document.addEventListener("click", (event) => {
  if (!accountMenu?.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.querySelector("[data-account-settings]")?.addEventListener("click", openSettings);
document.querySelector("[data-account-settings-close]")?.addEventListener("click", closeSettings);
settingsModal?.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    closeSettings();
  }
});

document.querySelector("[data-account-password]")?.addEventListener("click", async () => {
  if (!currentAccount?.email) {
    return;
  }

  const supabase = await getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(currentAccount.email, {
    redirectTo: new URL("reset-password.html", window.location.origin).toString(),
  });

  setStatus(
    error ? "Não foi possível enviar agora." : "Enviamos um link para alterar sua senha.",
    error ? "error" : "success"
  );
});

document.querySelector("[data-account-sign-out]")?.addEventListener("click", async () => {
  const supabase = await getSupabaseClient();
  await supabase?.auth.signOut();
  renderLoggedOut();
  setMenuOpen(false);
});

loadAccount();
