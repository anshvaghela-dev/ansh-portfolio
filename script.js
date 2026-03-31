const roles = [
  "Web Developer",
  "Frontend UI Builder",
  "Portfolio Website Designer"
];

const typingTarget = document.getElementById("typing");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const revealItems = document.querySelectorAll(".reveal");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetScrollPosition() {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
}

window.addEventListener("DOMContentLoaded", resetScrollPosition);
window.addEventListener("load", resetScrollPosition);
window.addEventListener("pageshow", resetScrollPosition);
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

function typeRole() {
  if (!typingTarget) {
    return;
  }

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

function setMenuState(isOpen) {
  if (!menuToggle || !navPanel) {
    return;
  }

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

typeRole();
