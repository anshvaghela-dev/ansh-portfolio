/* ── Project Details Page Script ── */

(function initDetailsPage() {
  const content = document.getElementById("pd-content");
  if (!content) return;

  // Get slug from URL: ?project=nest-mart-grocery-store
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("project");

  if (!slug) {
    showNotFound(content, "No project specified.");
    return;
  }

  fetch("projects.json")
    .then((res) => {
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    })
    .then((projects) => {
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        showNotFound(content, `Project "${slug}" not found.`);
        return;
      }
      document.title = `${project.title} — Ansh Vaghela`;
      renderProject(content, project);
    })
    .catch(() => {
      showNotFound(content, "Could not load project data.");
    });
})();

function renderProject(container, p) {
  const d = p.details || {};

  const imageHTML = p.image
    ? `<img src="${p.image}" alt="${p.title} preview">`
    : `<span>${p.title}</span>`;

  const imageClass = p.image ? "pd-hero-image" : "pd-hero-image no-image";

  const tagsHTML = (p.tags || []).map((t) => `<span>${t}</span>`).join("");

  const featuresHTML = buildList(d.features);
  const challengesHTML = buildList(d.challenges);
  const learningsHTML = buildList(d.learnings);

  container.innerHTML = `
    <!-- Hero -->
    <div class="pd-hero reveal">
      <div class="pd-hero-copy">
        <div class="pd-topline">
          <span class="pd-label">${p.label || "Project"}</span>
          <span class="pd-platform">${p.platform || ""}</span>
        </div>
        <h1 class="pd-title">${p.title}</h1>
        <p class="pd-description">${d.overview || p.description}</p>
        <div class="pd-tags">${tagsHTML}</div>
        <div class="pd-actions">
          ${p.liveUrl ? `<a class="button button-primary" href="${p.liveUrl}" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
          ${p.githubUrl ? `<a class="button button-secondary" href="${p.githubUrl}" target="_blank" rel="noreferrer">View on GitHub</a>` : ""}
        </div>
      </div>
      <div class="${imageClass}">${imageHTML}</div>
    </div>

    <!-- Meta bar -->
    <div class="pd-meta-bar reveal">
      ${d.role ? `<div class="pd-meta-item"><p>My Role</p><p>${d.role}</p></div>` : ""}
      ${d.duration ? `<div class="pd-meta-item"><p>Duration</p><p>${d.duration}</p></div>` : ""}
      <div class="pd-meta-item"><p>Platform</p><p>${p.platform || "—"}</p></div>
      <div class="pd-meta-item"><p>Status</p><p>Live &amp; Deployed</p></div>
    </div>

    <!-- Content sections -->
    <div class="pd-sections">
      ${featuresHTML ? `
        <div class="pd-section full-width reveal">
          <p class="pd-section-label">Features</p>
          <h3>What this project does</h3>
          <ul class="pd-list">${featuresHTML}</ul>
        </div>
      ` : ""}

      ${challengesHTML ? `
        <div class="pd-section reveal">
          <p class="pd-section-label">Challenges</p>
          <h3>What was difficult</h3>
          <ul class="pd-list">${challengesHTML}</ul>
        </div>
      ` : ""}

      ${learningsHTML ? `
        <div class="pd-section reveal">
          <p class="pd-section-label">Learnings</p>
          <h3>What I took away</h3>
          <ul class="pd-list">${learningsHTML}</ul>
        </div>
      ` : ""}
    </div>
  `;

  // Trigger reveal animations on newly added elements
  const newRevealItems = container.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  newRevealItems.forEach((el) => obs.observe(el));
}

function buildList(items) {
  if (!items || !items.length) return "";
  return items.map((item) => `<li>${item}</li>`).join("");
}

function showNotFound(container, msg) {
  container.innerHTML = `
    <div class="pd-not-found">
      <h2>Project not found</h2>
      <p>${msg}</p>
      <a class="button button-primary" href="index.html#projects">Back to Projects</a>
    </div>
  `;
}
