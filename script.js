// =========================
// NODE_0 CORE FIXED VERSION
// =========================

const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: signal corrupted.",
  "NODE_0: key fragment detected: 7A-Δ9"
];

let memory = parseInt(localStorage.getItem("node0_memory") || "0");
let clicks = parseInt(localStorage.getItem("node0_img_clicks") || "0");
let startTime = Date.now();

// =========================
// INPUT SYSTEM
// =========================

function go() {

  let input = document.getElementById("input");
  let output = document.getElementById("response");

  if (!input || !output) return;

  let text = input.value.toLowerCase();

  if (text.includes("line 7")) {
    output.innerText = "NODE_0: you noticed it.";
  }
  else if (text.includes("key")) {
    output.innerText = "NODE_0: fragments are incomplete alone.";
  }
  else if (text.includes("fracture")) {
    output.innerText = "NODE_0: why are you looking at that file?";
  }
  else {
    output.innerText = "NODE_0: signal unclear.";
  }

  input.value = "";
}

// =========================
// IMAGE CLICK SYSTEM
// =========================

window.onload = function () {

  let img = document.getElementById("fractureImage");
  let glitch = document.getElementById("glitchText");

  if (img) {
    img.addEventListener("click", function () {

      clicks++;
      localStorage.setItem("node0_img_clicks", clicks);

      if (!glitch) return;

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
  }
};

// =========================
// TIMER LOOP (FIXED)
// =========================

setInterval(function () {

  let timer = document.getElementById("timer");
  let glitch = document.getElementById("glitchText");
  let hidden = document.getElementById("hidden");

  if (!timer || !glitch || !hidden) return;

  memory++;
  localStorage.setItem("node0_memory", memory);

  let now = Date.now();
  let distance = targetDate - now;

  if (distance <= 0) {
    timer.innerText = "";
    hidden.style.display = "block";
    glitch.innerText = "NODE_0: connection lost.";
    return;
  }

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / 3600000);
  let minutes = Math.floor((distance % 3600000) / 60000);
  let seconds = Math.floor((distance % 60000) / 1000);

  timer.innerText = `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (Math.random() < 0.05) {
    glitch.innerText = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

}, 1000);
