// Shared game utilities
const STORAGE_KEY = "escape_progress";

function getProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    room1Unlocked: false,
    room2Unlocked: false,
    room3Unlocked: false,
    won: false,
    inventory: []
  };
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderInventory(inv) {
  const box = document.getElementById("inventory");
  if (!box) return;
  box.innerHTML = "";
  if (inv.length === 0) {
    box.innerHTML = `<span class="small">Empty</span>`;
    return;
  }
  inv.forEach(i => {
    const el = document.createElement("div");
    el.className = "item";
    el.textContent = i;
    box.appendChild(el);
  });
}

function updateProgressUI() {
  const progress = getProgress();
  const total = 3;
  const done = (progress.room1Unlocked ? 1 : 0) + (progress.room2Unlocked ? 1 : 0) + (progress.room3Unlocked ? 1 : 0);
  const bar = document.getElementById("progressBar");
  if (bar) {
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", pct);
    bar.textContent = `${done} / ${total}`;
  }
  const badge = document.getElementById("progressBadge");
  if (badge) badge.textContent = `${done}/${total}`;
}

function showBootstrapModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const modal = new bootstrap.Modal(el);
  modal.show();
}

function showToast(message, variant = "") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center text-bg-light border-0";
  toastEl.role = "alert";
  toastEl.ariaLive = "assertive";
  toastEl.ariaAtomic = "true";
  toastEl.innerHTML = `<div class=\"d-flex\"><div class=\"toast-body\">${message}</div><button type=\"button\" class=\"btn-close me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button></div>`;
  container.appendChild(toastEl);
  const t = new bootstrap.Toast(toastEl, { delay: 3000 });
  t.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Expose to global for old scripts compatibility
window.getProgress = getProgress;
window.saveProgress = saveProgress;
window.renderInventory = renderInventory;
window.updateProgressUI = updateProgressUI;
window.showBootstrapModal = showBootstrapModal;
window.showToast = showToast;

// Initialize once
document.addEventListener('DOMContentLoaded', () => {
  updateProgressUI();
});
