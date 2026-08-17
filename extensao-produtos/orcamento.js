const form = document.querySelector("#quickQuoteForm");
const statusMessage = document.querySelector("#quoteStatus");
const materialInput = document.querySelector("#material");
const medidasInput = document.querySelector("#medidas");
const quantidadeInput = document.querySelector("#quantidade");
const cidadeInput = document.querySelector("#cidade");
const clienteInput = document.querySelector("#cliente");
const detalhesInput = document.querySelector("#detalhes");
const previewFields = {
  material: document.querySelector("#previewMaterial"),
  medidas: document.querySelector("#previewMedidas"),
  quantidade: document.querySelector("#previewQuantidade"),
  instalacao: document.querySelector("#previewInstalacao"),
  cidade: document.querySelector("#previewCidade"),
};

const WHATSAPP_NUMBER = "554699358269";
const SAFE_TEXT_PATTERN = /[<>()[\]{}"'`\\|]/g;
const CONTROL_CHARS_PATTERN = /[\u0000-\u001f\u007f]/g;

function cleanText(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    .replace(CONTROL_CHARS_PATTERN, " ")
    .replace(SAFE_TEXT_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getSelectedInstallation() {
  return form.querySelector('input[name="instalacao"]:checked')?.value || "";
}

function getQuoteData() {
  const quantity = Number(quantidadeInput.value);

  return {
    material: cleanText(materialInput.value, 80),
    medidas: cleanText(medidasInput.value, 80),
    quantidade: Number.isInteger(quantity) && quantity > 0 ? String(Math.min(quantity, 99999)) : "",
    instalacao: cleanText(getSelectedInstallation(), 30),
    cidade: cleanText(cidadeInput.value, 70),
    cliente: cleanText(clienteInput.value, 80),
    detalhes: cleanText(detalhesInput.value, 240),
  };
}

function updatePreview() {
  const data = getQuoteData();
  previewFields.material.textContent = data.material || "Aguardando";
  previewFields.medidas.textContent = data.medidas || "Aguardando";
  previewFields.quantidade.textContent = data.quantidade || "Aguardando";
  previewFields.instalacao.textContent = data.instalacao || "Aguardando";
  previewFields.cidade.textContent = data.cidade || "Aguardando";
}

function validateQuote(data) {
  const missingFields = [];

  if (!data.material) missingFields.push("tipo de material");
  if (!data.medidas) missingFields.push("medidas");
  if (!data.quantidade) missingFields.push("quantidade");
  if (!data.instalacao) missingFields.push("instalação");
  if (!data.cidade) missingFields.push("cidade");

  return missingFields;
}

function buildWhatsAppMessage(data) {
  const lines = [
    "Olá, quero um orçamento rápido pela Artcolor.",
    "",
    `Tipo de material: ${data.material}`,
    `Medidas: ${data.medidas}`,
    `Quantidade: ${data.quantidade}`,
    `Precisa de instalação: ${data.instalacao}`,
    `Cidade: ${data.cidade}`,
  ];

  if (data.cliente) {
    lines.push(`Nome/empresa: ${data.cliente}`);
  }

  if (data.detalhes) {
    lines.push(`Detalhes extras: ${data.detalhes}`);
  }

  lines.push("", "Se precisar, posso enviar fotos e referências por aqui.");

  return lines.join("\n");
}

function submitQuote(event) {
  event.preventDefault();

  const data = getQuoteData();
  const missingFields = validateQuote(data);

  if (missingFields.length) {
    statusMessage.textContent = `Preencha: ${missingFields.join(", ")}.`;
    statusMessage.classList.add("is-error");
    return;
  }

  statusMessage.textContent = "Abrindo WhatsApp com seu pedido pronto.";
  statusMessage.classList.remove("is-error");

  const message = encodeURIComponent(buildWhatsAppMessage(data));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function hydrateFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const material = cleanText(params.get("material"), 80);

  if (material) {
    materialInput.value = material;
  }
}

hydrateFromQueryString();
updatePreview();

form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);
form.addEventListener("submit", submitQuote);
