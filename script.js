// =========================
// NODE_0 MINIMAL WORKING VERSION
// =========================

const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

function go() {
  const input = document.getElementById("input");
  const response = document.getElementById("response");

  if (!input || !response) return;

  const text = input.value.toLowerCase();

  if (text.includes("fracture")) {
    response.innerText = "NODE_0: you are not supposed to see that.";
  }
  else if (text.includes("hello")) {
    response.innerText = "NODE_0: ...";
  }
  else {
    response.innerText = "NODE_0: signal received.";
  }

  input.value = "";
}

// =========================
// TIMER (SAFE)
// =========================

setInterval(() => {

  const timer = document.getElementById("timer");
  const glitch = document.getElementById("glitchText");

  if (!timer) return;

  const now = Date.now();
  const distance = targetDate - now;

  if (distance <= 0) {
    timer.innerText = "NODE_0 ACTIVE";
    if (glitch) glitch.innerText = "NODE_0: connection established.";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

}, 1000);
