document.getElementById("resetBtn")?.addEventListener("click", () => {
  localStorage.removeItem("escape_progress");
  alert("Progress reset!");
  window.location.href = "index.html";
});
