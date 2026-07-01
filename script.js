const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: //signal corrupted//"
];

let memory = parseInt(localStorage.getItem("node0_memory") || "0");

// TIMER + GLITCH
const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  const timer = document.getElementById("timer");
  const hidden = document.getElementById("hidden");
  const glitch = document.getElementById("glitchText");

  if (!timer || !hidden || !glitch) return;

  memory++;
  localStorage.setItem("node0_memory", memory);

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

  if (Math.random() < 0.08) {
    glitch.innerText =
      glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

  if (memory % 50 === 0) {
    glitch.innerText = "NODE_0: stop repeating.";
  }

}, 1000);

// IA NODE_0
function go() {
  let input = document.getElementById("input").value.toLowerCase();
  let r = document.getElementById("response");

  let memory = parseInt(localStorage.getItem("node0_memory") || "0");

  if (input.includes("who")) {
    r.innerText = "NODE_0: you already saw me.";
  }
  else if (input.includes("why")) {
    r.innerText = "NODE_0: because you stayed.";
  }
  else if (input.includes("help")) {
    r.innerText = "NODE_0: no external help detected.";
  }
  else if (memory > 200) {
    r.innerText = "NODE_0: you are repeating yourself.";
  }
  else {
    r.innerText = "NODE_0: signal unclear.";
  }
}
