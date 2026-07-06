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
   (a unique ID per browser, stored locally,
   but all the real memory lives in Firebase)
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

/* local mirror of this player's Firebase messages */
let memory = [];

/* load this player's past messages from Firebase */
playerRef.child("messages").limitToLast(20).once("value", snap => {
    const val = snap.val();
    if (val) {
        memory = Object.values(val).map(m => m.text);
    }
});

/* record first visit if it doesn't exist yet */
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
========================= */
function trimLog() {
    while (log.children.length > 60) {
        log.removeChild(log.firstChild);
    }
}

function typewriter(el, fullText, speed = 28) {
    let i = 0;
    el.innerText = "";
    const iv = setInterval(() => {
        el.innerText += fullText[i];
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
        p.innerText = "YOU: " + text;
    }
    return p;
}

/* transient glitch on an already-displayed line (text always returns intact) */
function glitchFlicker(el) {
    const base = el.innerText;
    if (!base) return;
    let out = "";
    for (let i = 0; i < base.length; i++) {
        out += Math.random() < 0.15 ? sym[Math.floor(Math.random() * sym.length)] : base[i];
    }
    el.innerText = out;
    setTimeout(() => { el.innerText = base; }, 150);
}

/* ambient glitch loop over the whole log */
setInterval(() => {
    document.querySelectorAll("#log p").forEach(p => {
        if (Math.random() < 0.04) glitchFlicker(p);
    });
}, 900);

/* =========================
   NODE_0 - AMBIENT LINES
   (deliberately not fully coherent)
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

/* distorts a player's message for the echo reply (stays readable) */
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

/* NODE_0 talks on its own, even if nobody writes */
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
    ghost1.innerText = "";
    ghost2.innerText = "";

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
   (the actual text stays 100% readable and
   intact, this is a purely visual overlay)
========================= */
input.addEventListener("input", () => {
    ghost1.innerText = input.value;
    ghost2.innerText = input.value;
});

/* =========================
   GLITCH ON fracture.png
========================= */
setInterval(() => {
    if (!img) return;
    if (Math.random() < 0.35) {
        const hue = Math.floor(Math.random() * 40 - 20);
        const contrast = (1 + Math.random() * 0.6).toFixed(2);
        const bright = (0.9 + Math.random() * 0.3).toFixed(2);
        img.style.filter = `hue-rotate(${hue}deg) contrast(${contrast}) brightness(${bright})`;
        img.style.transform = `translate(${(Math.random() * 6 - 3).toFixed(1)}px, ${(Math.random() * 4 - 2).toFixed(1)}px)`;
        setTimeout(() => {
            img.style.transform = "translate(0,0)";
        }, 120);
    }
}, 1400);

/* =========================
   TIMER (shared via Firebase, see engine.js)
========================= */
function renderTimer() {
    const left = window.getTimeLeft();
    if (left === null) {
        timerEl.innerText = "synchronizing...";
        return;
    }
    if (left <= 0) {
        timerEl.innerText = "█ TIME COLLAPSED █";
        return;
    }
    const d = Math.floor(left / 86400);
    const h = Math.floor((left % 86400) / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = Math.floor(left % 60);
    timerEl.innerText =
        `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
setInterval(renderTimer, 1000);

/* =========================
   STATUS (evolves with player involvement)
========================= */
document.addEventListener("state-updated", () => {
    if (window.state.world?.layer2Triggered) {
        statusEl.innerText = "SYSTEM UNSTABLE";
    }
    if (window.state.world?.layer3Triggered) {
        statusEl.innerText = "SYSTEM COLLAPSED";
    }
});

/* welcome message */
setTimeout(() => {
    addMessage("NODE_0", "...connection established...");
}, 800);

});
