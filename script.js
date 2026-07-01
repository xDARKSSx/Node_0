// =========================
// NODE_0 CORE SYSTEM
// =========================

const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: //signal corrupted//"
];

// mémoire globale
let memory = parseInt(localStorage.getItem("node0_memory") || "0");

// historique utilisateur
let userHistory = JSON.parse(localStorage.getItem("node0_history") || "[]");

// =========================
// ANALYSE IA
// =========================
function analyzeInput(text) {
  userHistory.push(text);
  localStorage.setItem("node0_history", JSON.stringify(userHistory));

  let count = userHistory.length;

  if (count > 20) {
    return "NODE_0: you are persistent.";
  }

  if (userHistory.filter(x => x === text).length > 2) {
    return "NODE_0: repetition detected.";
  }

  if (text.includes("who")) {
    return "NODE_0: identity already fragmented.";
  }

  if (text.includes("why")) {
    return "NODE_0: meaning is not required.";
  }

  return null;
}

// =========================
// INPUT FUNCTION
// =========================
function go() {
  let input = document.getElementById("input").value.toLowerCase();
  let r = document.getElementById("response");

  let memoryValue = parseInt(localStorage.getItem("node0_memory") || "0");

  let result = analyzeInput(input);

  if (result) {
    r.innerText = result;
  }
  else if (input.includes("help")) {
    r.innerText = "NODE_0: no external help detected.";
  }
  else if (memoryValue > 200) {
    r.innerText = "NODE_0: system overload approaching.";
  }
  else {
    r.innerText = "NODE_0: signal unclear.";
  }
}

// =========================
// TIMER + GLITCH LOOP
// =========================
const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  const timer = document.getElementById("timer");
  const hidden = document.getElementById("hidden");
  const glitch = document.getElementById("glitchText");

  if (!timer || !hidden || !glitch) return;

  // mémoire tick
  memory++;
  localStorage.setItem("node0_memory", memory);

  // fin du timer
  if (distance <= 0) {
    clearInterval(x);

    timer.innerText = "";
    hidden.style.display = "block";
    glitch.innerText = "NODE_0: connection lost.";

    return;
  }

  // calcul temps
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  // glitch aléatoire
  if (Math.random() < 0.08) {
    glitch.innerText =
      glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

  // comportement répétitif
  if (memory % 50 === 0) {
    glitch.innerText = "NODE_0: stop repeating.";
  }

}, 1000);
