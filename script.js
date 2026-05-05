/* ── Roles for typewriter ── */
const roles = [
  "Web Developer",
  "Frontend UI Builder",
  "Portfolio Website Designer"
];

/* ── DOM refs ── */
const typingTarget   = document.getElementById("typing");
const menuToggle     = document.querySelector(".menu-toggle");
const navPanel       = document.querySelector(".nav-panel");
const navLinks       = document.querySelectorAll(".nav-panel a");
const revealItems    = document.querySelectorAll(".reveal");
const progressBar    = document.querySelector(".scroll-progress");
const themeToggle    = document.querySelector(".theme-toggle");
const bottomNavTabs  = document.querySelectorAll(".bottom-nav-tab");
const desktopNavLinks = document.querySelectorAll(".nav-panel a[href^='#']");
const footerYear     = document.getElementById("footer-year");

/* ── Footer year ── */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ── Scroll restoration ── */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetScrollPosition() {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

window.addEventListener("DOMContentLoaded", resetScrollPosition);
window.addEventListener("load", resetScrollPosition);
window.addEventListener("pageshow", resetScrollPosition);
window.addEventListener("beforeunload", () => { window.scrollTo(0, 0); });

/* ── Theme toggle ── */
const THEME_KEY = "theme";

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to light mode");
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to dark mode");
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {
    /* silently ignore — theme still applied in-memory */
  }
}

function handleThemeToggle() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
}

/* Initialise theme from saved preference or system preference */
(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (_) { /* ignore */ }

  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }
})();

if (themeToggle) {
  themeToggle.addEventListener("click", handleThemeToggle);
}

/* ── Scroll progress bar ── */
function updateScrollProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct.toFixed(2) + "%";
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* ── Active nav highlight ── */
const SECTIONS = ["top", "about", "services", "projects", "contact"];

function setActiveSection(id) {
  /* Desktop nav */
  desktopNavLinks.forEach((link) => {
    const matches = link.getAttribute("href") === "#" + id;
    link.classList.toggle("nav-active", matches);
    if (matches) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  /* Bottom nav */
  bottomNavTabs.forEach((tab) => {
    const matches = tab.dataset.section === id;
    tab.classList.toggle("active", matches);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id || "top";
        setActiveSection(id);
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

SECTIONS.forEach((id) => {
  const el = id === "top"
    ? document.querySelector("main")
    : document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ── Typewriter ── */
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
  if (!typingTarget) return;

  const activeRole = roles[roleIndex];
  typingTarget.textContent = activeRole.slice(0, charIndex);

  if (!isDeleting && charIndex < activeRole.length) {
    charIndex += 1;
  } else if (isDeleting && charIndex > 0) {
    charIndex -= 1;
  } else if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeRole, 1200);
    return;
  } else {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, isDeleting ? 45 : 90);
}

/* ── Mobile menu (desktop only — bottom nav handles mobile) ── */
function setMenuState(isOpen) {
  if (!menuToggle || !navPanel) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  navPanel.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      setMenuState(false);
    }
  });
}

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver(
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

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

/* ── Init ── */
typeRole();
