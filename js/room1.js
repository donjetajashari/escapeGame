let progress = window.getProgress();
window.renderInventory(progress.inventory);

// Desk search now uses a Bootstrap modal. Open modal when clicking.
document.getElementById("searchDeskBtn").addEventListener("click", () => {
  // open modal
  window.showBootstrapModal('deskNoteModal');
});

// When user takes the note from modal
document.getElementById("takeNoteBtn").addEventListener("click", () => {
  progress = window.getProgress();
  if (!progress.inventory.includes('note')) {
    progress.inventory.push('note');
    window.saveProgress(progress);
    window.renderInventory(progress.inventory);
    window.showToast('Note added to inventory');
    window.updateProgressUI();
  }
});

document.getElementById("unlockBtn").addEventListener("click", () => {
  const code = document.getElementById("codeInput").value.trim();
  const lockMsg = document.getElementById("lockMsg");
  progress = window.getProgress();

  if (code === "1997") {
    progress.room1Unlocked = true;
    progress.room2Unlocked = true;
    progress.won = false;
    window.saveProgress(progress);

    lockMsg.className = "small success";
    lockMsg.textContent = "Unlocked! The door opens...";
    document.getElementById("nextBtn").style.display = "inline-block";
    window.showToast('Room 1 unlocked');
    window.updateProgressUI();
  } else {
    lockMsg.className = "small error";
    lockMsg.textContent = "Wrong code. Try again.";
  }
});

if (progress.room1Unlocked) {
  document.getElementById("nextBtn").style.display = "inline-block";
}
