// NODE_0 - Countdown vers NODE_1 (1 mois + système glitch)

const targetDate = new Date("2026-08-08T00:00:00").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: //signal corrupted//"
];

// mémoire simple du joueur
let memory = parseInt(localStorage.getItem("node0_memory") || "0");

// TIMER + GLITCH LOOP
const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  let timer = document.getElementById("timer");
  let hidden = document.getElementById("hidden");
  let glitch = document.getElementById("glitchText");

  // sécurité
  if (!timer || !hidden || !glitch) return;

  // incrément mémoire
  memory++;
  localStorage.setItem("node0_memory", memory);

  // FIN DU TIMER
  if (distance <= 0) {
    clearInterval(x);

    timer.innerText = "";
    hidden.style.display = "block";
    glitch.innerText = "NODE_0: connection lost.";

    return;
  }

  // calcul temps restant
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  // GLITCH ALÉATOIRE (paranoïa légère)
  if (Math.random() < 0.08) {
    glitch.innerText = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

  // glitch basé sur comportement (petit effet “IA”)
  if (memory % 50 === 0) {
    glitch.innerText = "NODE_0: stop repeating.";
  }

}, 1000);
