// Placeholder JS for initial smoke test.
// In the next step, a Vite-built React(TypeScript) navbar will mount to #navbar-root.

window.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("navbar-root");
  if (el) {
    const hint = document.createElement("div");
    hint.style.fontSize = "0.875rem";
    hint.style.opacity = "0.7";
    hint.textContent = "Navbar island placeholder — React will mount here in the next step.";
    el.appendChild(hint);
  }

  fetch("/api/healthcheck")
    .then(r => r.json())
    .then(data => console.log("Healthcheck:", data))
    .catch(err => console.error("Healthcheck error:", err));
});
