import { SUPABASE_CONFIG, isSupabaseConfigured } from "./supabase-config.js";

const SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARS_PATTERN = /[\u0000-\u001f\u007f]/g;
const UNSAFE_TEXT_PATTERN = /[<>()[\]{}"'`\\|]/g;

const authTabs = document.querySelectorAll("[data-auth-tab]");
const authPanels = document.querySelectorAll("[data-auth-panel]");
const loginForm = document.querySelector("#loginPanel");
const registerForm = document.querySelector("#registerPanel");
const recoverForm = document.querySelector("#recoverPanel");
const rememberEmail = document.querySelector("#rememberEmail");
const rememberedEmailKey = "artcolor_auth_email";
const internalRoles = new Set(["staff", "admin", "developer"]);
let supabaseClientPromise = null;

function cleanText(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    .replace(CONTROL_CHARS_PATTERN, " ")
    .replace(UNSAFE_TEXT_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanText(value, 120).toLowerCase();
}

function setStatus(target, message, type = "info") {
  target.textContent = message;
  target.dataset.status = type;
}

function activateAuthTab(tabName) {
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  authPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.authPanel === tabName);
  });
}

function validateEmail(email) {
  return EMAIL_PATTERN.test(email);
}

function validatePasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.every(Boolean);
}

function saveRememberedEmail(email) {
  try {
    if (rememberEmail.checked) {
      localStorage.setItem(rememberedEmailKey, email);
      return;
    }

    localStorage.removeItem(rememberedEmailKey);
  } catch (error) {
    document.documentElement.dataset.authRememberFallback = "true";
  }
}

function hydrateRememberedEmail() {
  try {
    const savedEmail = localStorage.getItem(rememberedEmailKey);

    if (!savedEmail) {
      return;
    }

    document.querySelector("#loginEmail").value = savedEmail;
    rememberEmail.checked = true;
  } catch (error) {
    document.documentElement.dataset.authRememberFallback = "true";
  }
}

function providerUnavailableMessage() {
  return "O acesso está temporariamente indisponível. Tente novamente mais tarde.";
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

function getSiteUrl(path) {
  return new URL(path, window.location.origin).toString();
}

async function signInWithProvider({ email, password }) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

async function getSignedInProfile(userId) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

function getAreaByRole(role) {
  return internalRoles.has(role) ? "painel-interno.html" : "area-cliente.html";
}

async function registerWithProvider({ name, email, phone, password }) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getSiteUrl("login.html"),
      data: {
        full_name: name,
        phone,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function recoverWithProvider({ email }) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteUrl("reset-password.html"),
  });

  if (error) {
    throw error;
  }

  return data;
}

async function handleLogin(event) {
  event.preventDefault();

  const email = cleanEmail(loginForm.querySelector('[name="email"]').value);
  const password = loginForm.querySelector('[name="password"]').value;
  const status = document.querySelector("#loginStatus");

  if (!validateEmail(email)) {
    setStatus(status, "Informe um e-mail válido.", "error");
    return;
  }

  if (password.length < 8) {
    setStatus(status, "Informe sua senha.", "error");
    return;
  }

  saveRememberedEmail(email);

  if (!isSupabaseConfigured()) {
    setStatus(status, providerUnavailableMessage(), "warning");
    return;
  }

  try {
    const { user } = await signInWithProvider({ email, password });
    const profile = user ? await getSignedInProfile(user.id) : null;
    setStatus(status, "Login confirmado. Redirecionando para sua área.", "success");
    window.location.assign(getAreaByRole(profile?.role));
  } catch (error) {
    console.error("Artcolor auth login failed", {
      code: error?.code,
      status: error?.status,
      message: error?.message,
    });
    setStatus(status, "Não foi possível entrar. Confira os dados e tente novamente.", "error");
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const name = cleanText(registerForm.querySelector('[name="name"]').value, 90);
  const email = cleanEmail(registerForm.querySelector('[name="email"]').value);
  const phone = cleanText(registerForm.querySelector('[name="phone"]').value, 20);
  const password = registerForm.querySelector('[name="password"]').value;
  const status = document.querySelector("#registerStatus");

  if (!name || !validateEmail(email) || !phone) {
    setStatus(status, "Preencha nome, e-mail e telefone corretamente.", "error");
    return;
  }

  if (!validatePasswordStrength(password)) {
    setStatus(status, "A senha precisa ser mais forte para proteger sua conta.", "error");
    return;
  }

  if (!isSupabaseConfigured()) {
    setStatus(status, providerUnavailableMessage(), "warning");
    return;
  }

  try {
    await registerWithProvider({ name, email, phone, password });
    setStatus(status, "Conta criada. Verifique seu e-mail para confirmar o acesso.", "success");
    registerForm.reset();
  } catch (error) {
    setStatus(status, "Não foi possível criar a conta agora. Tente novamente em instantes.", "error");
  }
}

async function handleRecover(event) {
  event.preventDefault();

  const email = cleanEmail(recoverForm.querySelector('[name="email"]').value);
  const status = document.querySelector("#recoverStatus");

  if (!validateEmail(email)) {
    setStatus(status, "Informe o e-mail cadastrado.", "error");
    return;
  }

  if (!isSupabaseConfigured()) {
    setStatus(status, providerUnavailableMessage(), "warning");
    return;
  }

  try {
    await recoverWithProvider({ email });
    setStatus(status, "Se esse e-mail estiver cadastrado, enviaremos as instruções de recuperação.", "success");
  } catch (error) {
    setStatus(status, "Não foi possível enviar a recuperação agora.", "error");
  }
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateAuthTab(tab.dataset.authTab));
});

hydrateRememberedEmail();
loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);
recoverForm.addEventListener("submit", handleRecover);
