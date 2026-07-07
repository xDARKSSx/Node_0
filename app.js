document.addEventListener("DOMContentLoaded", () => {

/* =========================
   ELEMENTS
========================= */
const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const img = document.getElementById("fracture");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const titleEl = document.getElementById("pageTitle");
const ghost1 = document.getElementById("ghost1");
const ghost2 = document.getElementById("ghost2");
const ghostMain = document.getElementById("ghostMain");

/* =========================
   PLAYER IDENTITY
========================= */
function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

let memory = [];

playerRef.child("messages").limitToLast(20).once("value", snap => {
    const val = snap.val();
    if (val) {
        memory = Object.values(val).map(m => m.text);
    }
});

playerRef.child("firstSeen").once("value", snap => {
    if (!snap.exists()) {
        playerRef.child("firstSeen").set(firebase.database.ServerValue.TIMESTAMP);
    }
});

/* =========================
   GLITCH SYMBOLS
========================= */
const sym = ["█", "#", "%", "&", "@", "?", "Δ", "Ξ", "▓", "░"];
const sendSym = ["$", "%", "&", "\"", "!", "|"];

/* =========================
   LOG / CHAT
========================= */
function trimLog() {
    while (log.children.length > 60) {
        log.removeChild(log.firstChild);
    }
}

function typewriter(el, fullText, speed = 28) {
    let i = 0;
    el.textContent = "";
    const iv = setInterval(() => {
        el.textContent += fullText[i];
        i++;
        log.scrollTop = log.scrollHeight;
        if (i >= fullText.length) clearInterval(iv);
    }, speed);
}

function revealWithGlitch(el, finalText, symbolSet, steps = 6, stepDelay = 45) {
    let count = 0;
    const iv = setInterval(() => {
        let out = "";
        for (let i = 0; i < finalText.length; i++) {
            out += (finalText[i] !== " " && Math.random() < 0.3)
                ? symbolSet[Math.floor(Math.random() * symbolSet.length)]
                : finalText[i];
        }
        el.textContent = out;
        log.scrollTop = log.scrollHeight;
        count++;
        if (count >= steps) {
            clearInterval(iv);
            el.textContent = finalText;
        }
    }, stepDelay);
}

function addMessage(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "NODE_0" ? "node0" : "you";
    log.appendChild(p);
    trimLog();
    log.scrollTop = log.scrollHeight;

    if (sender === "NODE_0") {
        typewriter(p, "NODE_0: " + text);
    } else {
        revealWithGlitch(p, "YOU: " + text, sendSym);
    }
    return p;
}

function glitchFlicker(el) {
    if (!el) return;
    const base = el.textContent;
    if (!base) return;
    let out = "";
    for (let i = 0; i < base.length; i++) {
        out += Math.random() < 0.15 ? sym[Math.floor(Math.random() * sym.length)] : base[i];
    }
    el.textContent = out;
    setTimeout(() => { el.textContent = base; }, 150);
}

function cssGlitchPulse(el) {
    if (!el) return;
    const x = (Math.random() * 4 - 2).toFixed(1);
    el.style.transform = `translate(${x}px, 0)`;
    el.style.opacity = 0.55 + Math.random() * 0.3;
    setTimeout(() => {
        el.style.transform = "translate(0,0)";
        el.style.opacity = 1;
    }, 90);
}

setInterval(() => {
    document.querySelectorAll("#log p").forEach(p => {
        if (Math.random() < 0.04) glitchFlicker(p);
    });
    if (Math.random() < 0.05) glitchFlicker(statusEl);
    if (Math.random() < 0.04) glitchFlicker(titleEl);
    if (Math.random() < 0.12) cssGlitchPulse(timerEl);
}, 900);

/* =========================
   NODE_0 - AMBIENT LINES
========================= */
const ambientLines = [
    "...signal drifting...",
    "I shouldn't have woken up.",
    "someone
