const form = document.querySelector("#request-form");
const service = document.querySelector("#service");
const urgency = document.querySelector("#urgency");
const date = document.querySelector("#preferredDate");
const status = document.querySelector("#form-status");

// Remove drafts left by the former form; contact details no longer persist.
try { localStorage.removeItem("requestDraft"); } catch { /* Storage can be disabled. */ }

function localDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function updateNotes() {
  document.querySelector("#service-note").textContent = service.value === "otro"
    ? "Describe lo que ocurre y te ayudamos a identificar el servicio."
    : "El alcance y el costo se confirman después de evaluar el problema.";
  document.querySelector("#urgency-note").textContent = urgency.value === "Urgente"
    ? "Para una emergencia, llama al 936 872 862 y confirma la disponibilidad."
    : "Coordinaremos contigo el día y la hora de la visita.";
}

if (form) {
  const requested = new URLSearchParams(location.search).get("service");
  if ([...service.options].some(option => option.value === requested)) service.value = requested;
  date.min = localDate();
  form.querySelector('[type="submit"]').disabled = false;
  form.addEventListener("input", event => event.target.setCustomValidity?.(""));
  form.addEventListener("submit", event => {
    event.preventDefault();
    date.min = localDate();
    for (const name of ["fullname", "district", "notes"]) {
      const field = form.elements.namedItem(name);
      field.value = field.value.trim();
      const minimum = name === "notes" ? 10 : name === "fullname" ? 3 : 1;
      field.setCustomValidity(field.value.length >= minimum ? "" : `Escribe al menos ${minimum} caracteres.`);
    }
    const phone = form.elements.namedItem("phone");
    const digits = phone.value.replace(/\D/g, "");
    phone.setCustomValidity(/^[+\d\s()-]+$/.test(phone.value) && digits.length >= 9 && digits.length <= 15
      ? "" : "Escribe un teléfono válido, por ejemplo 936 872 862.");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const message = [
      `Hola Fernando, soy ${data.fullname}.`,
      `Necesito: ${service.selectedOptions[0].textContent}.`,
      `Problema: ${data.notes}`,
      `Distrito o zona: ${data.district}.`,
      `Prioridad: ${data.urgency}.`,
      ...(data.preferredDate ? [`Fecha preferida: ${data.preferredDate} (por confirmar).`] : []),
      `Mi teléfono: ${data.phone}.`,
    ].join("\n");
    status.textContent = "Abriendo WhatsApp. Revisa el mensaje y pulsa Enviar allí para contactar a Fernando.";
    // Same-tab navigation avoids pop-up blockers. Nothing is sent automatically.
    window.location.assign(`https://wa.me/51936872862?text=${encodeURIComponent(message)}`);
  });
  service.addEventListener("change", updateNotes);
  urgency.addEventListener("change", updateNotes);
  updateNotes();
}
