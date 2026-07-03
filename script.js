
// =========================
// NODE_0 CORE SYSTEM
// =========================

const targetDate = new Date("2026-08-08T00:00:00Z").getTime();

const glitchMessages = [
  "NODE_0: observation unstable...",
  "NODE_0: something is watching back.",
  "NODE_0: memory leak detected.",
  "NODE_0: you should not see this.",
  "NODE_0: //signal corrupted//",
  "NODE_0: image layer compromised."
];

const idleMessages = [
  "NODE_0: still here.",
  "NODE_0: listening...",
  "NODE_0: do not leave.",
  "NODE_0: connection stable.",
  "NODE_0: watching."
];

const node0ConflictMessages = [
  "NODE_0: that was not a failure.",
  "NODE_0: NODE_1 should not respond.",
  "NODE_0: the lock is not mine.",
  "NODE_0: something interfered.",
  "NODE_0: ignore system output."
];

// identité joueur
let userId = localStorage.getItem("node0_id");
if (!userId) {
  userId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("node0_id", userId);
}

let memory = parseInt(localStorage.getItem("node0_memory") || "0");
let userHistory = JSON.parse(localStorage.getItem("node0_history") || "[]");

let startTime = Date.now();


// =========================
// INPUT SYSTEM
// =========================

function analyzeInput(text) {

  userHistory.push(text);
  localStorage.setItem("node0_history", JSON.stringify(userHistory));

  if (text.includes("who")) return "NODE_0: you already saw me.";
  if (text.includes("why")) return "NODE_0: meaning not required.";
  if (text.includes("line 7")) return "NODE_0: you noticed it.";
  if (text.includes("key")) return "NODE_0: fragments are not complete alone.";
  if (text.includes("fracture")) return "NODE_0: why are you looking at that file?";

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
// IMAGE CLICK SYSTEM
// =========================

let imageClicks = parseInt(localStorage.getItem("node0_img_clicks") || "0");

const img = document.getElementById("fractureImage");

if (img) {

  img.addEventListener("click", () => {

    imageClicks++;
    localStorage.setItem("node0_img_clicks", imageClicks);

    let glitch = document.getElementById("glitchText");

    if (!glitch) return;

    if (imageClicks === 1) {
      glitch.innerText = "NODE_0: why did you touch that?";
    }
    else if (imageClicks < 7) {
      glitch.innerText = "NODE_0: stop.";
    }
    else if (imageClicks === 7) {
      glitch.innerText = "FRAME 07 RECOVERED";
      img.style.opacity = "0.2";
    }
    else {
      glitch.innerText = "NODE_0: I remember you.";
    }
  });
}


// =========================
// MAIN LOOP
// =========================

const x = setInterval(function () {

  const now = Date.now();
  const distance = targetDate - now;

  const timer = document.getElementById("timer");
  const hidden = document.getElementById("hidden");
  const glitch = document.getElementById("glitchText");

  if (!timer || !hidden || !glitch) return;

  memory++;
  localStorage.setItem("node0_memory", memory);

  let timeOnPage = (Date.now() - startTime) / 1000;


  if (distance <= 0) {

    clearInterval(x);

    timer.innerText = "";
    hidden.style.display = "block";

    if (Math.random() < 0.5) {
      glitch.innerText =
        node0ConflictMessages[
          Math.floor(Math.random() * node0ConflictMessages.length)
        ];
    } else {
      glitch.innerText =
        "NODE_0: connection attempt to NODE_1 failed.\n" +
        "REASON: ACCESS DENIED\n" +
        "STATUS: locked";
    }

    return;
  }


  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / 3600000);
  let minutes = Math.floor((distance % 3600000) / 60000);
  let seconds = Math.floor((distance % 60000) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;


  if (Math.random() < 0.08) {
    glitch.innerText =
      glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
  }

  if (memory % 50 === 0) {
    glitch.innerText = "NODE_0: stop repeating.";
  }

  if (timeOnPage > 30 && Math.random() < 0.05) {
    glitch.innerText =
      idleMessages[Math.floor(Math.random() * idleMessages.length)];
  }

  if (timeOnPage > 120) {
    glitch.innerText = "NODE_0: you are still here.";
  }

}, 1000);
