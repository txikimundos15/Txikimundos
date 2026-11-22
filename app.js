// ============================================================================
// LÓGICA DE NAVEGACIÓN Y CONFIGURADOR DE TXIKIMUNDOS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Estado actual del configurador
  const state = {
    recipienteId: TXIKI_CONFIG.recipientes[0].id, // Txikihuevito por defecto
    plantas: {},      // { "fitonia-verde": 2, ... }
    complementos: {}, // { "piedra-peq-blanca": 1, ... }
    estiloId: TXIKI_CONFIG.estilos[0].id
  };

  let currentSubView = "workspace"; // "workspace" | "checkout" | "confirmation"

  const formatPrice = (num) =>
    num.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const headerEl = document.getElementById("configurator-header");
  const workspaceEl = document.getElementById("configurator-workspace");
  const checkoutEl = document.getElementById("checkout-section");
  const confirmationEl = document.getElementById("confirmation-section");
  const mobileBarEl = document.getElementById("mobile-sticky-bar");

  function setSubView(mode) {
    currentSubView = mode;
    const isWorkspace = mode === "workspace";
    const isCheckout = mode === "checkout";
    const isConfirmation = mode === "confirmation";

    headerEl.hidden = !isWorkspace;
    headerEl.style.display = isWorkspace ? "" : "none";

    workspaceEl.hidden = !isWorkspace;
    workspaceEl.style.display = isWorkspace ? "" : "none";

    checkoutEl.hidden = !isCheckout;
    checkoutEl.style.display = isCheckout ? "" : "none";

    confirmationEl.hidden = !isConfirmation;
    confirmationEl.style.display = isConfirmation ? "" : "none";

    if (mobileBarEl) {
      const viewConfActive = document.getElementById("view-configurador").classList.contains("active");
      const showMobileBar = viewConfActive && isWorkspace;
      mobileBarEl.hidden = !showMobileBar;
      mobileBarEl.style.display = showMobileBar ? "" : "none";
    }
  }

  // --------------------------------------------------------------------------
  // 1. NAVEGACIÓN ENTRE SECCIONES
  // --------------------------------------------------------------------------
  const views = ["inicio", "configurador", "historias", "cuidados"];

  function navigateTo(viewName, updateHash = true) {
    if (!views.includes(viewName)) viewName = "inicio";

    // Si el usuario ya había finalizado un pedido y vuelve a entrar al configurador,
    // le preparamos el taller limpio para un nuevo diseño.
    if (viewName === "configurador" && currentSubView === "confirmation") {
      resetConfigurator(false, false);
    }

    document.querySelectorAll(".view").forEach((el) => el.classList.remove("active"));
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === viewName);
    });

    setSubView(currentSubView);

    if (updateHash) {
      history.pushState(null, "", `#${viewName}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(el.dataset.nav);
    });
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "");
    navigateTo(hash || "inicio", false);
  });

  // --------------------------------------------------------------------------
  // 2. RENDERIZADO DE CONTENIDO ESTÁTICO DESDE CONFIG.JS
  // --------------------------------------------------------------------------
  function renderStaticSections() {
    document.getElementById("hero-eyebrow").textContent = TXIKI_CONFIG.inicio.etiqueta;
    document.getElementById("hero-title").textContent = TXIKI_CONFIG.inicio.titulo;
    document.getElementById("hero-subtitle").textContent = TXIKI_CONFIG.inicio.subtitulo;

    const pillarsContainer = document.getElementById("pillars-container");
    pillarsContainer.innerHTML = TXIKI_CONFIG.inicio.pilares
      .map(
        (p, idx) => `
        <article class="pillar-card">
          <span class="pillar-num">0${idx + 1}</span>
          <h3>${p.titulo}</h3>
          <p>${p.texto}</p>
        </article>`
      )
      .join("");

    const storiesGrid = document.getElementById("stories-grid");
    storiesGrid.innerHTML = TXIKI_CONFIG.historias
      .map(
        (h) => `
        <article class="story-card">
          <div class="story-photo">
            <img src="${h.imagen}" alt="${h.titulo}"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
            <span style="display:none;">📷 Foto pendiente: <code>${h.imagen}</code></span>
          </div>
          <div class="story-body">
            <div class="story-meta">${h.fecha}</div>
            <h3>${h.titulo}</h3>
            <span class="story-tag">${h.recipiente}</span>
            <p>${h.texto}</p>
          </div>
        </article>`
      )
      .join("");

    const careGrid = document.getElementById("care-grid");
    careGrid.innerHTML = TXIKI_CONFIG.cuidados
      .map(
        (c) => `
        <article class="care-card">
          <h3>${c.titulo}</h3>
          <p>${c.texto}</p>
        </article>`
      )
      .join("");

    const faqList = document.getElementById("faq-list");
    faqList.innerHTML = TXIKI_CONFIG.faqs
      .map(
        (f, i) => `
        <div class="faq-item ${i === 0 ? "open" : ""}">
          <button type="button" class="faq-question">
            <span>${f.pregunta}</span>
            <span>+</span>
          </button>
          <div class="faq-answer">${f.respuesta}</div>
        </div>`
      )
      .join("");

    faqList.querySelectorAll(".faq-question").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.classList.toggle("open");
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. MOTOR DE COMPATIBILIDADES Y CÁLCULO DEL CONFIGURADOR
  // --------------------------------------------------------------------------
  function getGroupUsedCount(grupoId) {
    return TXIKI_CONFIG.plantas
      .filter((p) => p.grupoId === grupoId)
      .reduce((acc, p) => acc + (state.plantas[p.id] || 0), 0);
  }

  function enforceCompatibilityOnContainerChange() {
    const adjustments = [];
    TXIKI_CONFIG.gruposPlantas.forEach((grupo) => {
      const maxAllowed = grupo.maximoPorRecipiente[state.recipienteId] ?? 0;
      const groupPlants = TXIKI_CONFIG.plantas.filter((p) => p.grupoId === grupo.id);
      let used = getGroupUsedCount(grupo.id);

      if (used > maxAllowed) {
        for (let i = groupPlants.length - 1; i >= 0 && used > maxAllowed; i--) {
          const p = groupPlants[i];
          const current = state.plantas[p.id] || 0;
          if (current > 0) {
            const remove = Math.min(current, used - maxAllowed);
            state.plantas[p.id] = current - remove;
            if (state.plantas[p.id] === 0) delete state.plantas[p.id];
            used -= remove;
            adjustments.push(`${p.nombre} (-${remove})`);
          }
        }
      }
    });

    const alertBox = document.getElementById("compatibility-alert");
    if (adjustments.length > 0) {
      alertBox.hidden = false;
      alertBox.innerHTML = `Hemos adaptado automáticamente tu selección al espacio del nuevo recipiente: <strong>${adjustments.join(", ")}</strong>.`;
    } else {
      alertBox.hidden = true;
    }
  }

  function renderContainers() {
    const grid = document.getElementById("containers-grid");
    grid.innerHTML = TXIKI_CONFIG.recipientes
      .map((rec) => {
        const selected = rec.id === state.recipienteId;
        return `
        <div class="option-card selectable ${selected ? "is-selected" : ""}" data-select-container="${rec.id}">
          <div>
            <div class="card-thumb">
              <img src="${rec.imagen}" alt="${rec.nombre}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <span style="display:none;">🫙 <code>${rec.imagen}</code></span>
            </div>
            <div class="option-title-row">
              <h3 class="option-title">${rec.nombre}</h3>
              <span class="option-price">${formatPrice(rec.precio)}</span>
            </div>
            <div class="option-meta">${rec.medidas}</div>
            <p class="option-desc">${rec.descripcion}</p>
          </div>
          <div>
            <span class="group-quota-pill">${selected ? "✓ Seleccionado" : "Seleccionar"}</span>
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll("[data-select-container]").forEach((card) => {
      card.addEventListener("click", () => {
        state.recipienteId = card.dataset.selectContainer;
        enforceCompatibilityOnContainerChange();
        renderAllConfigurator();
      });
    });
  }

  function renderPlants() {
    const container = document.getElementById("plants-groups-container");
    container.innerHTML = TXIKI_CONFIG.gruposPlantas
      .map((grupo) => {
        const maxAllowed = grupo.maximoPorRecipiente[state.recipienteId] ?? 0;
        const usedInGroup = getGroupUsedCount(grupo.id);
        const isCompatible = maxAllowed > 0;

        const groupPlantsHtml = TXIKI_CONFIG.plantas
          .filter((p) => p.grupoId === grupo.id)
          .map((planta) => {
            const qty = state.plantas[planta.id] || 0;
            const canAdd = isCompatible && usedInGroup < maxAllowed;

            return `
            <div class="option-card ${!isCompatible ? "is-disabled" : qty > 0 ? "is-selected" : ""}">
              <div>
                <div class="card-thumb">
                  <img src="${planta.imagen}" alt="${planta.nombre}"
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                  <span style="display:none;">🌱 <code>${planta.imagen}</code></span>
                </div>
                <div class="option-title-row">
                  <h4 class="option-title">${planta.nombre}</h4>
                  <span class="option-price">+${formatPrice(planta.precio)}</span>
                </div>
                <p class="option-desc">${planta.detalle}</p>
              </div>

              ${
                !isCompatible
                  ? `<div><span class="incompat-badge">No compatible con este cristal</span></div>`
                  : `<div class="counter-control">
                      <button type="button" class="counter-btn" data-plant-minus="${planta.id}" ${qty === 0 ? "disabled" : ""} aria-label="Quitar ${planta.nombre}">−</button>
                      <span class="counter-value">${qty}</span>
                      <button type="button" class="counter-btn" data-plant-plus="${planta.id}" ${!canAdd ? "disabled" : ""} aria-label="Añadir ${planta.nombre}">+</button>
                    </div>`
              }
            </div>`;
          })
          .join("");

        return `
        <div class="plant-group-section">
          <div class="plant-group-header">
            <div>
              <h3>${grupo.nombre}</h3>
              <p class="step-desc">${grupo.descripcion}</p>
            </div>
            <span class="group-quota-pill ${!isCompatible ? "is-incompatible" : ""}">
              ${
                !isCompatible
                  ? "No disponible en este recipiente"
                  : `Seleccionadas: ${usedInGroup} / ${maxAllowed} máx.`
              }
            </span>
          </div>
          <div class="cards-grid cards-grid-3">
            ${groupPlantsHtml}
          </div>
        </div>`;
      })
      .join("");

    container.querySelectorAll("[data-plant-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.plantPlus;
        const planta = TXIKI_CONFIG.plantas.find((p) => p.id === id);
        const grupo = TXIKI_CONFIG.gruposPlantas.find((g) => g.id === planta.grupoId);
        const maxAllowed = grupo.maximoPorRecipiente[state.recipienteId] ?? 0;
        if (getGroupUsedCount(grupo.id) < maxAllowed) {
          state.plantas[id] = (state.plantas[id] || 0) + 1;
          renderAllConfigurator();
        }
      });
    });

    container.querySelectorAll("[data-plant-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.plantMinus;
        if ((state.plantas[id] || 0) > 0) {
          state.plantas[id] -= 1;
          if (state.plantas[id] === 0) delete state.plantas[id];
          renderAllConfigurator();
        }
      });
    });
  }

  function renderAccessories() {
    const grid = document.getElementById("accessories-grid");
    grid.innerHTML = TXIKI_CONFIG.complementos
      .map((comp) => {
        const qty = state.complementos[comp.id] || 0;
        return `
        <div class="option-card ${qty > 0 ? "is-selected" : ""}">
          <div>
            <div class="card-thumb">
              <img src="${comp.imagen}" alt="${comp.nombre}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <span style="display:none;">🪨 <code>${comp.imagen}</code></span>
            </div>
            <div class="option-title-row">
              <h3 class="option-title">${comp.nombre}</h3>
              <span class="option-price">+${formatPrice(comp.precio)}</span>
            </div>
            <p class="option-desc">${comp.detalle}</p>
          </div>
          <div class="counter-control">
            <button type="button" class="counter-btn" data-acc-minus="${comp.id}" ${qty === 0 ? "disabled" : ""}>−</button>
            <span class="counter-value">${qty}</span>
            <button type="button" class="counter-btn" data-acc-plus="${comp.id}" ${qty >= comp.maximo ? "disabled" : ""}>+</button>
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll("[data-acc-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.accPlus;
        const comp = TXIKI_CONFIG.complementos.find((c) => c.id === id);
        if ((state.complementos[id] || 0) < comp.maximo) {
          state.complementos[id] = (state.complementos[id] || 0) + 1;
          renderAllConfigurator();
        }
      });
    });

    grid.querySelectorAll("[data-acc-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.accMinus;
        if ((state.complementos[id] || 0) > 0) {
          state.complementos[id] -= 1;
          if (state.complementos[id] === 0) delete state.complementos[id];
          renderAllConfigurator();
        }
      });
    });
  }

  function renderStyles() {
    const grid = document.getElementById("styles-grid");
    grid.innerHTML = TXIKI_CONFIG.estilos
      .map((est) => {
        const selected = est.id === state.estiloId;
        return `
        <div class="option-card selectable ${selected ? "is-selected" : ""}" data-select-style="${est.id}">
          <div>
            <div class="card-thumb">
              <img src="${est.imagen}" alt="${est.nombre}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <span style="display:none;">⛰️ <code>${est.imagen}</code></span>
            </div>
            <div class="option-title-row">
              <h3 class="option-title">${est.nombre}</h3>
              <span class="option-price">${est.precio > 0 ? "+" + formatPrice(est.precio) : "Incluido"}</span>
            </div>
            <p class="option-desc">${est.descripcion}</p>
          </div>
          <div>
            <span class="group-quota-pill">${selected ? "✓ Estilo elegido" : "Elegir estilo"}</span>
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll("[data-select-style]").forEach((card) => {
      card.addEventListener("click", () => {
        state.estiloId = card.dataset.selectStyle;
        renderAllConfigurator();
      });
    });
  }

  function getOrderBreakdown() {
    const recipiente = TXIKI_CONFIG.recipientes.find((r) => r.id === state.recipienteId);
    const estilo = TXIKI_CONFIG.estilos.find((e) => e.id === state.estiloId);

    const items = [
      {
        categoria: "Recipiente",
        nombre: recipiente.nombre,
        cantidad: 1,
        subtotal: recipiente.precio
      }
    ];

    Object.entries(state.plantas).forEach(([id, qty]) => {
      const p = TXIKI_CONFIG.plantas.find((item) => item.id === id);
      if (p && qty > 0) {
        items.push({
          categoria: "Planta",
          nombre: p.nombre,
          cantidad: qty,
          subtotal: p.precio * qty
        });
      }
    });

    Object.entries(state.complementos).forEach(([id, qty]) => {
      const c = TXIKI_CONFIG.complementos.find((item) => item.id === id);
      if (c && qty > 0) {
        items.push({
          categoria: "Complemento",
          nombre: c.nombre,
          cantidad: qty,
          subtotal: c.precio * qty
        });
      }
    });

    items.push({
      categoria: "Estilo",
      nombre: `Estilo ${estilo.nombre}`,
      cantidad: 1,
      subtotal: estilo.precio
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    return { recipiente, estilo, items, total };
  }

  function renderSummary() {
    const { recipiente, estilo, items, total } = getOrderBreakdown();

    document.getElementById("summary-container-title").textContent = recipiente.nombre;
    document.getElementById("summary-style-subtitle").textContent = `Estilo: ${estilo.nombre}`;

    const previewImg = document.getElementById("summary-preview-img");
    const previewHint = document.getElementById("summary-photo-hint");
    previewImg.style.display = "block";
    previewImg.nextElementSibling.style.display = "none";
    previewImg.src = recipiente.imagen;
    previewHint.textContent = recipiente.imagen;

    const listEl = document.getElementById("summary-items-list");
    const hasPlants = Object.keys(state.plantas).length > 0;

    listEl.innerHTML =
      items
        .map(
          (it) => `
        <div class="summary-line ${it.categoria !== "Recipiente" ? "summary-line-sub" : ""}">
          <span>${it.cantidad > 1 ? `${it.cantidad} × ` : ""}${it.nombre}</span>
          <strong>${it.subtotal > 0 ? formatPrice(it.subtotal) : "Incluido"}</strong>
        </div>`
        )
        .join("") +
      (!hasPlants
        ? `<p class="summary-empty-hint">Aún no has añadido plantas en el paso 2.</p>`
        : "");

    document.getElementById("summary-total-price").textContent = formatPrice(total);
    document.getElementById("mobile-total-price").textContent = formatPrice(total);
  }

  function renderAllConfigurator() {
    renderContainers();
    renderPlants();
    renderAccessories();
    renderStyles();
    renderSummary();
  }

  // --------------------------------------------------------------------------
  // 4. REINICIO DE DISEÑO (EMPEZAR DE NUEVO) Y FLUJO DE CHECKOUT
  // --------------------------------------------------------------------------
  function resetConfigurator(showNotice = true, shouldScroll = true) {
    state.recipienteId = TXIKI_CONFIG.recipientes[0].id;
    state.plantas = {};
    state.complementos = {};
    state.estiloId = TXIKI_CONFIG.estilos[0].id;

    document.getElementById("order-form").reset();
    document.getElementById("email-match-error").hidden = true;
    document.getElementById("form-global-error").hidden = true;

    setSubView("workspace");
    renderAllConfigurator();

    const alertBox = document.getElementById("compatibility-alert");
    if (showNotice) {
      alertBox.hidden = false;
      alertBox.innerHTML = "Has reiniciado tu diseño. Puedes volver a configurar tu Txikimundo desde el paso 1.";
    } else {
      alertBox.hidden = true;
    }

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  document.getElementById("btn-reset-top").addEventListener("click", () => resetConfigurator(true, true));

  function openCheckout() {
    const { items, total } = getOrderBreakdown();
    document.getElementById("checkout-recap-items").innerHTML = items
      .map(
        (it) => `
        <div class="summary-line">
          <span>${it.cantidad > 1 ? `${it.cantidad} × ` : ""}${it.nombre}</span>
          <strong>${it.subtotal > 0 ? formatPrice(it.subtotal) : "Incluido"}</strong>
        </div>`
      )
      .join("");
    document.getElementById("checkout-recap-total").textContent = formatPrice(total);

    document.getElementById("compatibility-alert").hidden = true;
    setSubView("checkout");

    checkoutEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("btn-go-checkout").addEventListener("click", openCheckout);
  document.getElementById("mobile-btn-checkout").addEventListener("click", openCheckout);

  document.getElementById("btn-back-configurator").addEventListener("click", () => {
    setSubView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Validación en tiempo real del doble correo electrónico
  const emailInput = document.getElementById("cust-email");
  const emailConfirmInput = document.getElementById("cust-email-confirm");
  const emailErrorEl = document.getElementById("email-match-error");

  function checkEmailMatch() {
    if (emailConfirmInput.value && emailInput.value.trim() !== emailConfirmInput.value.trim()) {
      emailErrorEl.hidden = false;
      return false;
    }
    emailErrorEl.hidden = true;
    return true;
  }

  emailInput.addEventListener("input", checkEmailMatch);
  emailConfirmInput.addEventListener("input", checkEmailMatch);

  document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const globalErr = document.getElementById("form-global-error");
    globalErr.hidden = true;

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const email = emailInput.value.trim();
    const emailConfirm = emailConfirmInput.value.trim();
    const notes = document.getElementById("cust-notes").value.trim();
    const privacyOk = document.getElementById("consent-privacy").checked;
    const whatsappOk = document.getElementById("consent-whatsapp").checked;

    if (!name || !phone || !email || !emailConfirm) {
      globalErr.textContent = "Por favor, completa todos los campos obligatorios marcados con *.";
      globalErr.hidden = false;
      return;
    }

    if (email !== emailConfirm) {
      emailErrorEl.hidden = false;
      globalErr.textContent = "Los dos correos electrónicos deben coincidir exactamente.";
      globalErr.hidden = false;
      return;
    }

    if (!privacyOk) {
      globalErr.textContent = "Debes aceptar la Política de Privacidad para poder enviar tu pedido.";
      globalErr.hidden = false;
      return;
    }

    const { items, total } = getOrderBreakdown();
    const orderRef = "TXK-" + Math.floor(100000 + Math.random() * 900000);

    const payload = {
      referencia: orderRef,
      fecha: new Date().toLocaleString("es-ES"),
      cliente: { nombre: name, telefono: phone, email, notas: notes },
      autorizaWhatsApp: whatsappOk ? "Sí" : "No",
      desglose: items,
      total: formatPrice(total)
    };

    const submitBtn = document.getElementById("btn-submit-order");
    submitBtn.disabled = true;
    submitBtn.textContent = "Registrando tu pedido...";

    try {
      if (TXIKI_CONFIG.googleScriptUrl) {
        await fetch(TXIKI_CONFIG.googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      document.getElementById("conf-order-ref").textContent = `Referencia de pedido: ${orderRef}`;
      document.getElementById("conf-customer-email").textContent = email;
      document.getElementById("conf-items-list").innerHTML = items
        .map(
          (it) => `
          <div class="summary-line">
            <span>${it.cantidad > 1 ? `${it.cantidad} × ` : ""}${it.nombre}</span>
            <strong>${it.subtotal > 0 ? formatPrice(it.subtotal) : "Incluido"}</strong>
          </div>`
        )
        .join("");
      document.getElementById("conf-total-price").textContent = formatPrice(total);
      document.getElementById("conf-customer-meta").innerHTML = `
        <strong>Datos registrados:</strong> ${name} · Tel: ${phone} · Email: ${email}<br/>
        <strong>Contacto por WhatsApp autorizado:</strong> ${whatsappOk ? "Sí" : "No (solo por email)"}
        ${notes ? `<br/><strong>Notas:</strong> ${notes}` : ""}
      `;

      setSubView("confirmation");
      confirmationEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      globalErr.textContent = "Hubo un problema de conexión al enviar el pedido. Inténtalo de nuevo.";
      globalErr.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Finalizar compra y enviar pedido";
    }
  });

  // --------------------------------------------------------------------------
  // 5. MODAL DE POLÍTICA DE PRIVACIDAD
  // --------------------------------------------------------------------------
  const privacyModal = document.getElementById("privacy-modal");
  document.getElementById("open-privacy-link").addEventListener("click", (e) => {
    e.preventDefault();
    privacyModal.hidden = false;
  });
  document.getElementById("footer-privacy-btn").addEventListener("click", () => {
    privacyModal.hidden = false;
  });
  document.getElementById("close-privacy-modal").addEventListener("click", () => {
    privacyModal.hidden = true;
  });
  privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) privacyModal.hidden = true;
  });

  // Inicialización
  renderStaticSections();
  renderAllConfigurator();
  setSubView("workspace");
  const initialHash = window.location.hash.replace("#", "");
  if (views.includes(initialHash)) {
    navigateTo(initialHash, false);
  }
});
