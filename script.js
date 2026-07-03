
// =========================
// NODE_0 SAFE CORE VERSION
// =========================

console.log("NODE_0 SYSTEM ONLINE");

// DATE DU COMPTE À REBOURS
const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

// =========================
// INPUT SAFE
// =========================

function go() {

  const input = document.getElementById("input");
  const response = document.getElementById("response");

  if (!input || !response) return;

  const text = input.value.toLowerCase();

  if (text.includes("fracture")) {
    response.innerText = "NODE_0: you shouldn't look at that.";
  }
  else if (text.includes("who")) {
    response.innerText = "NODE_0: not relevant.";
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
// TIMER SAFE LOOP
// =========================

setInterval(() => {

  const timer = document.getElementById("timer");
  const glitch = document.getElementById("glitchText");

  // sécurité anti-crash
  if (!timer) return;

  const now = Date.now();
  const distance = targetDate - now;

  if (distance <= 0) {

    timer.innerText = "NODE_0 ACTIVE";

    if (glitch) {
      glitch.innerText = "NODE_0: connection established.";
    }

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

}, 1000);


// =========================
// IMAGE CLICK SAFE (OPTIONNEL)
// =========================

window.addEventListener("load", () => {

  const img = document.getElementById("fractureImage");
  const glitch = document.getElementById("glitchText");

  if (!img || !glitch) return;

  let clicks = 0;

  img.addEventListener("click", () => {

    clicks++;

    if (clicks === 1) {
      glitch.innerText = "NODE_0: why did you touch that?";
    }
    else if (clicks < 7) {
      glitch.innerText = "NODE_0: stop.";
    }
    else if (clicks === 7) {
      glitch.innerText = "FRAME 07 RECOVERED";
      img.style.opacity = "0.2";
    }
    else {
      glitch.innerText = "NODE_0: I remember you.";
    }
  });

});
