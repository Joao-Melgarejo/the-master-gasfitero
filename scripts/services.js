import { getServiceCategories, getServices } from "./data.js";

const WHATSAPP_NUMBER = "51936872862";

const grid = document.querySelector("#services-grid");
const status = document.querySelector("#services-status");
const count = document.querySelector("#service-count");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#service-search");
const dialog = document.querySelector("#service-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");

let services = [];

function whatsappLink(service) {
  const message = `Hola Fernando, necesito el servicio de ${service.name}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function updateCount(items) {
  const plural = items.length === 1 ? "" : "s";
  if (count) {
    count.textContent = `${items.length} servicio${plural} encontrado${plural}`;
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function serviceMatches(service, selectedCategory, searchTerm) {
  const categoryMatches = selectedCategory === "Todos" || service.category === selectedCategory;
  const searchableText = normalizeText(`${service.name} ${service.summary} ${service.idealFor}`);
  return categoryMatches && searchableText.includes(normalizeText(searchTerm));
}

function createServiceCard(service) {
  return `
    <article class="service-card" id="service-${service.id}">
      <img src="${service.image}" alt="${service.imageAlt}" width="520" height="390" loading="lazy">
      <div class="service-card__body">
        <div class="card-meta">
          <span class="pill">${service.category}</span>
        </div>
        <h3>${service.name}</h3>
        <p>${service.summary}</p>
        <dl class="service-facts">
          <div>
            <dt>Respuesta</dt>
            <dd>${service.response}</dd>
          </div>
          <div>
            <dt>Duración</dt>
            <dd>${service.duration}</dd>
          </div>
          <div>
            <dt>Verificación</dt>
            <dd>${service.warranty}</dd>
          </div>
        </dl>
        <div class="hero-actions">
          <button class="button button--small button--outline-navy" type="button" data-service="${service.id}">Ver detalles</button>
          <a class="button button--small button--wa" href="${whatsappLink(service)}" target="_blank" rel="noopener">Solicitar</a>
        </div>
      </div>
    </article>
  `;
}

function getFilteredServices() {
  const selectedCategory = categoryFilter?.value || "Todos";
  const searchTerm = searchInput?.value.trim().toLowerCase() || "";

  return services.filter((service) => serviceMatches(service, selectedCategory, searchTerm));
}

function renderServices() {
  if (!grid) return;

  const filteredServices = getFilteredServices();
  updateCount(filteredServices);

  if (filteredServices.length === 0) {
    grid.innerHTML = `
      <p class="notice">No encontramos servicios con esos filtros. Prueba con otra categoría o palabra clave.</p>
    `;
    return;
  }

  grid.innerHTML = filteredServices.map(createServiceCard).join("");
}

function openServiceDialog(serviceId) {
  const service = services.find((item) => item.id === serviceId);

  if (!service || !dialog || !dialogTitle || !dialogContent) return;

  dialogTitle.textContent = service.name;
  dialogContent.innerHTML = `
    <img src="${service.image}" alt="${service.imageAlt}" width="520" height="390" loading="lazy">
    <p>${service.details}</p>
    <dl class="dialog-facts">
      <div>
        <dt>Categoría</dt>
        <dd>${service.category}</dd>
      </div>
      <div>
        <dt>Ideal para</dt>
        <dd>${service.idealFor}</dd>
      </div>
      <div>
        <dt>Tiempo estimado</dt>
        <dd>${service.duration}</dd>
      </div>
      <div>
        <dt>Respuesta</dt>
        <dd>${service.response}</dd>
      </div>
    </dl>
    <div class="hero-actions">
      <a class="button button--wa" href="${whatsappLink(service)}" target="_blank" rel="noopener">Solicitar por WhatsApp</a>
      <a class="text-link" href="contact.html?service=${service.id}">Usar el formulario</a>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function populateCategories() {
  if (!categoryFilter) return;

  categoryFilter.innerHTML = getServiceCategories(services)
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function handleGridClick(event) {
  const serviceButton = event.target.closest("[data-service]");

  if (serviceButton) {
    openServiceDialog(serviceButton.dataset.service);
  }
}

function openRequestedService() {
  const serviceId = new URLSearchParams(window.location.search).get("service");

  if (serviceId) {
    openServiceDialog(serviceId);
  }
}

async function initServicesPage() {
  if (!grid) return;

  try {
    services = await getServices();
    populateCategories();
    renderServices();
    document.querySelector(".filters").hidden = false;
    openRequestedService();

    if (status) {
      status.textContent = "";
    }
  } catch (error) {
    if (count) {
      count.textContent = "";
    }
    status.textContent = "Puedes consultar cualquier servicio con los enlaces de abajo. La búsqueda no está disponible en este momento.";
  }
}

grid?.addEventListener("click", handleGridClick);
categoryFilter?.addEventListener("change", renderServices);
searchInput?.addEventListener("input", renderServices);
dialog?.querySelector(".modal-close")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

initServicesPage();
