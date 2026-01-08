
// Shared storage key used in game.js; keep minimal local logic, use game.js helpers
let progress = window.getProgress();
window.renderInventory(progress.inventory);

const guardMsg = document.getElementById("guardMsg");
const mainCard = document.getElementById("mainCard");
const lockIds = ["searchToolboxBtn", "searchLockerBtn", "craftBtn", "useKeycardBtn"];

function setLockedUI(isLocked) {
  if (isLocked) {
    guardMsg.style.display = "block";
    guardMsg.textContent = "Room 2 is locked. Go back and finish Room 1 first.";
    mainCard.classList.add("locked-card");
    lockIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.disabled = true;
        btn.classList.add("disabled-btn");
      }
    });
  } else {
    guardMsg.style.display = "none";
    mainCard.classList.remove("locked-card");
    lockIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("disabled-btn");
      }
    });
  }
}

// Ensure room2 can't be unlocked without room1
if (progress.room2Unlocked && !progress.room1Unlocked) {
  progress.room2Unlocked = false;
  window.saveProgress(progress);
}

if (!progress.room2Unlocked) setLockedUI(true);
else setLockedUI(false);

// Toolbox
document.getElementById("searchToolboxBtn").addEventListener("click", () => {
  const toolboxResult = document.getElementById("toolboxResult");
  progress = window.getProgress();
  if (!progress.inventory.includes("magnet")) {
    progress.inventory.push("magnet");
    window.saveProgress(progress);
    window.renderInventory(progress.inventory);
    toolboxResult.innerHTML = `You found a <b>magnet</b>.`;
    window.showToast('Picked up: magnet');
  } else {
    toolboxResult.textContent = "Nothing else inside.";
  }
});

// Locker
document.getElementById("searchLockerBtn").addEventListener("click", () => {
  const lockerResult = document.getElementById("lockerResult");
  progress = window.getProgress();
  if (!progress.inventory.includes("plastic-card")) {
    progress.inventory.push("plastic-card");
    window.saveProgress(progress);
    window.renderInventory(progress.inventory);
    lockerResult.innerHTML = `You found a <b>plastic-card</b> (blank).`;
    window.showToast('Picked up: plastic-card');
  } else {
    lockerResult.textContent = "Empty.";
  }
});

// Craft: magnet + plastic-card => keycard
document.getElementById("craftBtn").addEventListener("click", () => {
  const craftMsg = document.getElementById("craftMsg");
  progress = window.getProgress();
  const hasMagnet = progress.inventory.includes("magnet");
  const hasCard = progress.inventory.includes("plastic-card");

  if (progress.inventory.includes("keycard")) {
    craftMsg.className = "small";
    craftMsg.textContent = "You already crafted the keycard.";
    return;
  }

  if (hasMagnet && hasCard) {
    progress.inventory = progress.inventory.filter(i => i !== "magnet" && i !== "plastic-card");
    progress.inventory.push("keycard");
    window.saveProgress(progress);
    window.renderInventory(progress.inventory);

    craftMsg.className = "small success";
    craftMsg.textContent = "Craft success! You made a KEYCARD.";
    // show modal
    const modalBody = document.getElementById('craftModalBody');
    if (modalBody) modalBody.innerHTML = '<p>You assembled the magnet and card into a <b>keycard</b>.</p>';
    window.showBootstrapModal('craftModal');
    window.showToast('Crafted: keycard');
  } else {
    craftMsg.className = "small error";
    craftMsg.textContent = "You need: magnet + plastic-card.";
  }
});

// Use keycard -> unlock room3
document.getElementById("useKeycardBtn").addEventListener("click", () => {
  const doorMsg = document.getElementById("doorMsg");
  progress = window.getProgress();
  if (progress.inventory.includes("keycard")) {
    progress.room3Unlocked = true;
    window.saveProgress(progress);

    doorMsg.className = "small success";
    doorMsg.textContent = "Door unlocked! You can enter Room 3.";
    document.getElementById("nextBtn").style.display = "inline-block";
    window.showToast('Room 3 unlocked');
    window.updateProgressUI();
  } else {
    doorMsg.className = "small error";
    doorMsg.textContent = "You don’t have a keycard.";
  }
});

if (progress.room3Unlocked) {
  document.getElementById("nextBtn").style.display = "inline-block";
} else {
  document.getElementById("nextBtn").style.display = "none";
}

// keep next link hidden if locked; setLockedUI already handles button disabling
