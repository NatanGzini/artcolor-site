const products = [
  {
    name: "Adesivos de troca de óleo",
    category: "adesivos",
    tag: "Automotivo",
    image: "assets/produtos/adesivos-troca-oleo.png",
    description:
      "Controle de troca de óleo com visual da sua oficina, campos claros e informação fácil para o cliente voltar.",
  },
  {
    name: "Adesivos personalizados",
    category: "adesivos",
    tag: "Personalizados",
    image: "assets/produtos/adesivos-personalizados.png",
    description:
      "Adesivos para embalagem, identificação, promoção, vitrine ou entrega. Feitos no formato que o uso pede.",
  },
  {
    name: "Brindes personalizados",
    category: "brindes",
    tag: "Corporativo",
    image: "assets/produtos/brindes.png",
    description:
      "Brindes para colocar sua marca na mão do cliente: ações, eventos, kits e campanhas comerciais.",
  },
  {
    name: "Cartões de visita",
    category: "impressos",
    tag: "Impresso",
    image: "assets/produtos/cartoes-visita.png",
    description:
      "Cartões para deixar contato, apresentar serviço e passar uma primeira impressão mais profissional.",
  },
  {
    name: "Crachás personalizados",
    category: "brindes",
    tag: "Identificação",
    image: "assets/produtos/crachas-personalizados.png",
    description:
      "Identificação para equipe, evento ou atendimento, com visual limpo e informação fácil de ler.",
  },
  {
    name: "Displays personalizados",
    category: "comunicacao",
    tag: "PDV",
    image: "assets/produtos/displays-personalizados.png",
    description:
      "Displays para balcão, mesa e ponto de venda. Destaque promoção, produto, cardápio ou aviso importante.",
  },
  {
    name: "Fichas personalizadas",
    category: "impressos",
    tag: "Controle",
    image: "assets/produtos/fichas-personalizadas.png",
    description:
      "Fichas para consumo, controle, evento, comanda e organização do atendimento sem improviso.",
  },
  {
    name: "Folders personalizados",
    category: "impressos",
    tag: "Divulgação",
    image: "assets/produtos/folders-personalizados.png",
    description:
      "Folders para explicar serviços, divulgar ofertas e entregar informação comercial de um jeito organizado.",
  },
  {
    name: "Lacres personalizados",
    category: "adesivos",
    tag: "Segurança",
    image: "assets/produtos/lacres.png",
    description:
      "Lacres para embalagem, segurança, delivery e identificação. Mais cuidado na entrega e mais presença da marca.",
  },
  {
    name: "Letras 3D",
    category: "comunicacao",
    tag: "Fachada",
    image: "assets/produtos/letras-3d.png",
    description:
      "Letras 3D para fachada, recepção e parede. Volume, leitura e acabamento para destacar o nome da empresa.",
  },
  {
    name: "Lona impressa com madeira e cordão",
    category: "comunicacao",
    tag: "Sinalização",
    image: "assets/produtos/lona-impressa.png",
    description:
      "Lona impressa pronta para pendurar, sinalizar, divulgar campanha ou organizar a comunicação do ambiente.",
  },
  {
    name: "Quadros personalizados",
    category: "decoracao",
    tag: "Decoração",
    image: "assets/produtos/quadros.png",
    description:
      "Quadros para decorar, ambientar e reforçar identidade em lojas, escritórios e espaços personalizados.",
  },
  {
    name: "Artes para redes sociais",
    category: "digital",
    tag: "Digital",
    image: "assets/produtos/social-midias.png",
    description:
      "Artes para redes sociais, campanhas e anúncios quando sua comunicação também precisa vender no digital.",
  },
  {
    name: "Windbanners",
    category: "comunicacao",
    tag: "Eventos",
    image: "assets/produtos/windbanners.png",
    description:
      "Windbanners para frente de loja, evento e ação promocional. Fácil de montar e difícil de passar despercebido.",
  },
];

const tabs = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");
const productGrid = document.querySelector("#productGrid");
const productSearch = document.querySelector("#productSearch");
const siteSearchForm = document.querySelector("#siteSearchForm");
const siteSearch = document.querySelector("#siteSearch");
const filterButtons = document.querySelectorAll("[data-category]");
const countUpItems = document.querySelectorAll(".count-up");
const siteLoader = document.querySelector("#siteLoader");
const cookieBanner = document.querySelector("#cookieBanner");
const privacyModal = document.querySelector("#privacyModal");
const privacyOpenButtons = document.querySelectorAll("[data-privacy-open]");
const privacyCloseButtons = document.querySelectorAll("[data-privacy-close]");
const cookieAcceptButtons = document.querySelectorAll("[data-cookie-accept]");
const cookieRejectButtons = document.querySelectorAll("[data-cookie-reject]");

let selectedCategory = "todos";
let revealObserver;
let counterObserver;

if (window.AOS) {
  AOS.init({
    duration: 560,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
}

function hideSiteLoader() {
  if (!siteLoader) {
    return;
  }

  window.setTimeout(() => {
    siteLoader.classList.add("is-hidden");
  }, 2750);
}

function activateTab(tabName, options = {}) {
  const { focusNav = true, updateHash = true } = options;

  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === tabName));
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === tabName));

  if (updateHash) {
    history.replaceState(null, "", `#${tabName}`);
  }

  if (focusNav) {
    document.querySelector(`[data-tab="${tabName}"]`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  if (window.AOS) {
    window.setTimeout(() => AOS.refresh(), 80);
  }
}

function getValidTabFromHash() {
  const hashTab = window.location.hash.replace("#", "") || "inicio";
  return document.querySelector(`[data-panel="${hashTab}"]`) ? hashTab : "inicio";
}

function syncTabFromHash() {
  activateTab(getValidTabFromHash(), { focusNav: false, updateHash: false });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function renderProducts() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<div class="empty-state">Nenhum produto encontrado.</div>';
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card reveal-item" data-aos="fade-up">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <span class="tag">${product.tag}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <a class="product-link" href="orcamento.html?material=${encodeURIComponent(product.name)}">
              Orçamento rápido
            </a>
          </div>
        </article>
      `
    )
    .join("");

  observeRevealItems();

  if (window.AOS) {
    AOS.refreshHard();
  }
}

function openProductSearch(term = "") {
  const cleanTerm = term.trim();

  selectedCategory = "todos";
  filterButtons.forEach((item) => item.classList.toggle("is-active", item.dataset.category === "todos"));

  productSearch.value = cleanTerm;
  renderProducts();
  activateTab("produtos");

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    productSearch.focus({ preventScroll: true });
  });
}

function observeRevealItems() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal-item").forEach((item) => revealObserver.observe(item));
}

function animateCounter(item) {
  const targetValue = Number(item.dataset.count);
  const duration = 1500;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    item.textContent = Math.floor(easedProgress * targetValue).toLocaleString("pt-BR");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      item.textContent = targetValue.toLocaleString("pt-BR");
    }
  }

  requestAnimationFrame(updateCounter);
}

function setupCounters() {
  if (!countUpItems.length) {
    return;
  }

  counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.75 }
  );

  countUpItems.forEach((item) => counterObserver.observe(item));
}

function getStoredCookieConsent() {
  try {
    return localStorage.getItem("artcolor_cookie_consent");
  } catch (error) {
    return null;
  }
}

function setCookieConsent(status) {
  try {
    localStorage.setItem(
      "artcolor_cookie_consent",
      JSON.stringify({
        status,
        date: new Date().toISOString(),
        version: "2026-07",
      })
    );
  } catch (error) {
    document.documentElement.dataset.cookieConsent = status;
  }

  cookieBanner?.classList.remove("is-visible");
  closePrivacyModal();
}

function setupPrivacyControls() {
  if (!cookieBanner || !privacyModal) {
    return;
  }

  const storedConsent = getStoredCookieConsent();

  if (!storedConsent) {
    window.setTimeout(() => cookieBanner.classList.add("is-visible"), 3200);
  }

  privacyOpenButtons.forEach((button) => {
    button.addEventListener("click", () => openPrivacyModal());
  });

  privacyCloseButtons.forEach((button) => {
    button.addEventListener("click", closePrivacyModal);
  });

  cookieAcceptButtons.forEach((button) => {
    button.addEventListener("click", () => setCookieConsent("accepted"));
  });

  cookieRejectButtons.forEach((button) => {
    button.addEventListener("click", () => setCookieConsent("rejected"));
  });

  privacyModal.addEventListener("click", (event) => {
    if (event.target === privacyModal) {
      closePrivacyModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && privacyModal.classList.contains("is-visible")) {
      closePrivacyModal();
    }
  });
}

function openPrivacyModal() {
  privacyModal?.classList.add("is-visible");
  privacyModal?.setAttribute("aria-hidden", "false");
}

function closePrivacyModal() {
  privacyModal?.classList.remove("is-visible");
  privacyModal?.setAttribute("aria-hidden", "true");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

document.querySelectorAll("[data-tab-target]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
});

siteSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openProductSearch(siteSearch.value);
});

document.querySelectorAll("[data-product-search]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    openProductSearch(item.dataset.productSearch || "");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderProducts();
  });
});

productSearch.addEventListener("input", renderProducts);
window.addEventListener("hashchange", syncTabFromHash);

syncTabFromHash();
renderProducts();
setupCounters();
setupPrivacyControls();

if (document.readyState === "complete") {
  hideSiteLoader();
} else {
  window.addEventListener("load", hideSiteLoader, { once: true });
}
