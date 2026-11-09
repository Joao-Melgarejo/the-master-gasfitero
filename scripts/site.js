const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#primary-nav");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("is-open")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    navToggle.focus();
  }
});
const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-link").forEach((link) => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

const year = document.querySelector("#currentyear");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Duplicate a full group so the leftward loop has no visible reset.
const clientsStrip = document.querySelector(".clients-strip");
if (clientsStrip) {
  const track = clientsStrip.querySelector(".clients-track");
  const list = track.querySelector(".clients-list");
  const copy = list.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  copy.setAttribute("inert", "");
  track.append(copy);
  clientsStrip.classList.add("is-ready");
}
