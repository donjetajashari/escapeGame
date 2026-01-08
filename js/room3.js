let progress = window.getProgress();
window.renderInventory(progress.inventory);

const guardMsg = document.getElementById("guardMsg");
const mainCard = document.getElementById("mainCard");
const submitBtn = document.getElementById("submitBtn");
const hintBtn = document.getElementById("hintBtn");

function setLockedUI(isLocked) {
  if (isLocked) {
    guardMsg.style.display = "block";
    guardMsg.textContent = "Room 3 is locked. Finish Room 2 first.";
    mainCard.classList.add("locked-card");
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled-btn");
    if (hintBtn) hintBtn.disabled = true;
  } else {
    guardMsg.style.display = "none";
    mainCard.classList.remove("locked-card");
    submitBtn.disabled = false;
    submitBtn.classList.remove("disabled-btn");
    if (hintBtn) hintBtn.disabled = false;
  }
}

// Ensure room3 isn't marked unlocked unless room2 was unlocked first
if (progress.room3Unlocked && !progress.room2Unlocked) {
  progress.room3Unlocked = false;
  window.saveProgress(progress);
}

if (!progress.room3Unlocked) setLockedUI(true);
else setLockedUI(false);

submitBtn.addEventListener("click", () => {
  const msg = document.getElementById("msg");
  const input = document.getElementById("answerInput").value.trim().toLowerCase();

  const correct = ["echo", "an echo"];
  progress = window.getProgress();

  if (correct.includes(input)) {
    progress.won = true;
    window.saveProgress(progress);

    msg.className = "small success";
    msg.textContent = "Correct! The final door unlocks...";
    document.getElementById("winBtn").style.display = "inline-block";
    window.showToast('You solved the final riddle — well done!');
  } else {
    msg.className = "small error";
    msg.textContent = "Wrong answer. Try again.";
  }
});

if (progress.won) {
  document.getElementById("winBtn").style.display = "inline-block";
}

// Hint button opens the modal
if (hintBtn) {
  hintBtn.addEventListener('click', () => window.showBootstrapModal('hintModal'));
}

// Ensure win link is hidden until solved
if (!progress.won) document.getElementById("winBtn").style.display = "none";
