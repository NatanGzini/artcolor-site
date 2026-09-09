import { SUPABASE_CONFIG, isSupabaseConfigured } from "./supabase-config.js";

const SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const form = document.querySelector("#resetPasswordForm");
const statusMessage = document.querySelector("#resetStatus");
let supabaseClientPromise = null;

function setStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.dataset.status = type;
}

function validatePasswordStrength(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
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

if (!isSupabaseConfigured()) {
  setStatus("A recuperação está temporariamente indisponível. Tente novamente mais tarde.", "warning");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const supabase = await getSupabaseClient();

  if (!supabase) {
    setStatus("A recuperação está temporariamente indisponível. Tente novamente mais tarde.", "warning");
    return;
  }

  const newPassword = form.querySelector('[name="newPassword"]').value;
  const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

  if (!validatePasswordStrength(newPassword)) {
    setStatus("A senha precisa ter 8 caracteres, uma maiúscula, um número e um símbolo.", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    setStatus("As senhas não conferem.", "error");
    return;
  }

  setStatus("Atualizando sua senha...", "info");

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    setStatus("Não foi possível atualizar a senha. Abra o link mais recente enviado por e-mail.", "error");
    return;
  }

  setStatus("Senha atualizada com sucesso. Você já pode entrar na sua conta.", "success");
  form.reset();
});
