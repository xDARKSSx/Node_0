const targetDate = new Date("2026-07-08T00:00:00").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: //signal corrupted//"
];

// TIMER
const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  let timer = document.getElementById("timer");
  let hidden = document.getElementById("hidden");
  let glitch = document.getElementById("glitchText");

  if (!timer || !hidden || !glitch) return;

  if (distance <= 0) {
    clearInterval(x);
    timer.innerText = "";
    hidden.style.display = "block";
    glitch.innerText = "NODE_0: connection lost.";
    return;
  }

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  // GLITCH aléatoire
  if (Math.random() < 0.09) {
    glitch.innerText = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

}, 1000);
