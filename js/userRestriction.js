// Configuration
const USAGE_LIMIT_MINUTES = 1;
const LOCKOUT_MINUTES = 0.5;
const USAGE_LIMIT_MS = USAGE_LIMIT_MINUTES * 60 * 1000;

// DOM elements
const overlay = document.getElementById("time-restriction-overlay");
const textOverlay = document.getElementById("textOverlay");
const loading = document.getElementById("loading");
const scene = document.querySelector("a-scene");

// Helper functions
function shouldHideTextOverlay() {
  return !(window.arOverlayActive === true);
}
function showOverlay(msg) {
  overlay.innerHTML = msg;
  overlay.style.display = "flex";
  if (textOverlay && shouldHideTextOverlay()) textOverlay.style.display = "none";
  if (loading) loading.style.display = "none";
  if (scene) scene.style.display = "none";
}
function showUsageTimer(msg) {
  overlay.innerHTML = msg;
  overlay.style.display = "flex";
  if (textOverlay && shouldHideTextOverlay()) textOverlay.style.display = "none";
  if (loading) loading.style.display = "none";
}
function hideOverlay() {
  overlay.style.display = "none";
  if (textOverlay && shouldHideTextOverlay()) textOverlay.style.display = "";
  if (loading) loading.style.display = "";
  if (scene) scene.style.display = "";
}
function hideSceneAndLoading() {
  if (scene) scene.style.display = "none";
  if (loading) loading.style.display = "none";
  if (textOverlay && shouldHideTextOverlay()) textOverlay.style.display = "none";
}
function showSceneAndLoading() {
  if (scene) scene.style.display = "";
  if (loading) loading.style.display = "";
}
function getNow() {
  return Date.now();
}
function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

let lockoutInterval = null;
function startLockoutTimer() {
  hideSceneAndLoading();
  if (lockoutInterval) clearInterval(lockoutInterval);
  lockoutInterval = setInterval(() => {
    const lockoutUntil = localStorage.getItem("lockoutUntil");
    const now = getNow();
    if (lockoutUntil && now < parseInt(lockoutUntil, 10)) {
      const msLeft = parseInt(lockoutUntil, 10) - now;
      showOverlay(
        `Max is tired. He'll be back in ${formatTime(msLeft)}`
      );
    } else {
      clearInterval(lockoutInterval);
      localStorage.removeItem("lockoutUntil");
      hideOverlay();
      showSceneAndLoading();
      startUsageTimer();
    }
  }, 1000);
}

// Usage timer state
let usageInterval = null;
let remainingTime = null; // ms
let lastActive = null; // timestamp
let lastHidden = null; // timestamp
let isActive = true;

function saveUsageState() {
  localStorage.setItem("usageRemaining", remainingTime);
  localStorage.setItem("usageLastActive", lastActive);
  localStorage.setItem("usageLastHidden", lastHidden || "");
}
function loadUsageState() {
  remainingTime = parseInt(localStorage.getItem("usageRemaining"), 10);
  if (isNaN(remainingTime)) remainingTime = USAGE_LIMIT_MS;
  lastActive = parseInt(localStorage.getItem("usageLastActive"), 10);
  if (isNaN(lastActive)) lastActive = getNow();
  lastHidden = localStorage.getItem("usageLastHidden");
  if (lastHidden) lastHidden = parseInt(lastHidden, 10);
  else lastHidden = null;
}
function clearUsageState() {
  localStorage.removeItem("usageRemaining");
  localStorage.removeItem("usageLastActive");
  localStorage.removeItem("usageLastHidden");
}

function startUsageTimer() {
  clearUsageState(); 
  loadUsageState();
  showSceneAndLoading();
  overlay.style.display = "block";
  if (usageInterval) clearInterval(usageInterval);
  isActive = true;
  lastActive = getNow();
  saveUsageState();
  usageInterval = setInterval(() => {
    if (!isActive) return;
    remainingTime -= 1000;
    if (remainingTime > 0) {
      showUsageTimer(`Time left: ${formatTime(remainingTime)}`);
      saveUsageState();
    } else {
      // Set lockout
      const lockoutUntil = getNow() + LOCKOUT_MINUTES * 60 * 1000;
      localStorage.setItem("lockoutUntil", lockoutUntil);
      // Do NOT clear usage state here
      startLockoutTimer();
      clearInterval(usageInterval);
    }
  }, 1000);
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    // User left the page
    isActive = false;
    lastHidden = getNow();
    saveUsageState();
  } else if (document.visibilityState === "visible") {
    // User returned
    const now = getNow();
    if (lastHidden && remainingTime > 0) {
      const awayTime = now - lastHidden;
      // Add half of away time to remainingTime, but not above the max
      const bonus = Math.floor(awayTime / 4);
      remainingTime = Math.min(USAGE_LIMIT_MS, remainingTime + bonus);
      showUsageTimer(`Time left: ${formatTime(remainingTime)}`);
      saveUsageState();
    }
    isActive = true;
    lastActive = now;
  }
}

function checkLockout() {
  const lockoutUntil = localStorage.getItem("lockoutUntil");
  if (lockoutUntil && getNow() < parseInt(lockoutUntil, 10)) {
    startLockoutTimer();
    return true;
  }
  return false;
}

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
  if (checkLockout()) {
    return;
  }
  startUsageTimer();
});

