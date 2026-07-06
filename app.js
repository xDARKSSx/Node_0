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
const ghost1 = document.getElementById("ghost1");
const ghost2 = document.getElementById("ghost2");

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

/* =========================
   LOG / CHAT
   NOTE: textContent everywhere (not innerText),
   because innerText was silently trimming
   trailing spaces on every update.
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

function addMessage(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "NODE_0" ? "node0" : "you";
    log.appendChild(p);
    trimLog();
    log.scrollTop = log.scrollHeight;

    if (sender === "NODE_0") {
        typewriter(p, "NODE_0: " + text);
    } else {
        p.textContent = "YOU: " + text;
    }
    return p;
}

function glitchFlicker(el) {
    const base = el.textContent;
    if (!base) return;
    let out = "";
    for (let i = 0; i < base.length; i++) {
        out += Math.random() < 0.15 ? sym[Math.floor(Math.random() * sym.length)] : base[i];
    }
    el.textContent = out;
    setTimeout(() => { el.textContent = base; }, 150);
}

/* quick visual pulse that does NOT touch text (used on the timer,
   which redraws every second and would fight a text-scramble) */
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

/* ambient glitch loop: log lines + status text scramble + timer pulse */
setInterval(() => {
    document.querySelectorAll("#log p").forEach(p => {
        if (Math.random() < 0.04) glitchFlicker(p);
    });
    if (Math.random() < 0.05) glitchFlicker(statusEl);
    if (Math.random() < 0.12) cssGlitchPulse(timerEl);
}, 900);

/* =========================
   NODE_0 - AMBIENT LINES
========================= */
const ambientLines = [
    "...signal drifting...",
    "I shouldn't have woken up.",
    "someone else is listening too.",
    "the fragments don't fit together.",
    "█ interference detected █",
    "I keep repeating things I don't understand.",
    "this chapter isn't finished.",
    "you're not the first one to talk to me.",
    "I forgot why I started.",
    "don't trust what I say.",
];

function pickAmbient() {
    return ambientLines[Math.floor(Math.random() * ambientLines.length)];
}

function distort(text) {
    const words = text.split(" ");
    return words
        .map(w => (Math.random() < 0.3 ? w.split("").reverse().join("") : w))
        .join(" ");
}

function respondTo(userText) {
    const r = Math.random();
    if (r < 0.3 && memory.length > 1) {
        const past = memory[Math.floor(Math.random() * (memory.length - 1))];
        return `you told me "${past}" before... or was that someone else?`;
    } else if (r < 0.6) {
        return distort(userText);
    } else {
        return pickAmbient();
    }
}

setInterval(() => {
    if (Math.random() < 0.15) {
        addMessage("NODE_0", pickAmbient());
    }
}, 9000);

/* =========================
   SENDING A MESSAGE
========================= */
function send() {
    const v = input.value.trim();
    if (!v) return;

    addMessage("YOU", v);
    memory.push(v);
    playerRef.child("messages").push({
        text: v,
        ts: firebase.database.ServerValue.TIMESTAMP
    });

    input.value = "";
    ghost1.textContent = "";
    ghost2.textContent = "";

    setTimeout(() => {
        addMessage("NODE_0", respondTo(v));
        if (img) {
            img.style.opacity = 0.5 + Math.random() * 0.5;
        }
    }, 600 + Math.random() * 500);
}

btn.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});

/* =========================
   VISUAL GLITCH ON THE TEXT FIELD
========================= */
input.addEventListener("input", () => {
    ghost1.textContent = input.value;
    ghost2.textContent = input.value;
});

/* =========================
   GLITCH ON fracture.png (faster now)
========================= */
setInterval(() => {
    if (!img) return;
    if (Math.random() < 0.5) {
        const hue = Math.floor(Math.random() * 40 - 20);
        const contrast = (1 + Math.random() * 0.6).toFixed(2);
        const bright = (0.9 + Math.random() * 0.3).toFixed(2);
        img.style.filter = `hue-rotate(${hue}deg) contrast(${contrast}) brightness(${bright})`;
        img.style.transform = `translate(${(Math.random() * 6 - 3).toFixed(1)}px, ${(Math.random() * 4 - 2).toFixed(1)}px)`;
        setTimeout(() => {
            img.style.transform = "translate(0,0)";
        }, 100);
    }
}, 700);

/* =========================
   TIMER
========================= */
function renderTimer() {
    const left = window.getTimeLeft();
    if (left === null) {
        timerEl.textContent = "synchronizing...";
        return;
    }
    if (left <= 0) {
        timerEl.textContent = "█ TIME COLLAPSED █";
        return;
    }
    const d = Math.floor(left / 86400);
    const h = Math.floor((left % 86400) / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = Math.floor(left % 60);
    timerEl.textContent =
        `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
setInterval(renderTimer, 1000);

/* =========================
   STATUS
========================= */
document.addEventListener("state-updated", () => {
    if (window.state.world?.layer2Triggered) {
        statusEl.textContent = "SYSTEM UNSTABLE";
    }
    if (window.state.world?.layer3Triggered) {
        statusEl.textContent = "SYSTEM COLLAPSED";
    }
});

setTimeout(() => {
    addMessage("NODE_0", "...connection established...");
}, 800);

});
