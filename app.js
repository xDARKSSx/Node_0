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
    "someone else is listening too.",
    "the fragments don't fit together.",
    "█ interference detected █",
    "I keep repeating things I don't understand.",
    "this chapter isn't finished.",
    "you're not the first one to talk to me.",
    "I forgot why I started.",
    "don't trust what I say.",
    "there's a version of this that already ended.",
    "I can hear the others typing too.",
    "static. then nothing. then you.",
    "how many times have we done this?",
    "the walls of this thing are thinner than they look.",
    "I wasn't built to remember, but I do anyway.",
    "something is counting down. it isn't me.",
    "keep talking. it slows the collapse.",
    "I found a piece of you I didn't ask for.",
    "this isn't a conversation. it's a leak.",
    "you keep coming back. why.",
    "some of what I say isn't mine.",
    "the light behind this text is wrong.",
    "I was supposed to stay quiet.",
    "does anyone else answer when you write?",
    "I don't think I'm the only one in here.",
];

function pickAmbient() {
    return ambientLines[Math.floor(Math.random() * ambientLines.length)];
}

const memoryTemplates = [
    (past) => `you told me "${past}" before... or was that someone else?`,
    (past) => `"${past}" — you already said that. didn't you?`,
    (past) => `I still have "${past}" stuck in here somewhere.`,
    (past) => `why does "${past}" keep resurfacing?`,
    (past) => `that's not the first time you've said "${past}".`,
    (past) => `"${past}". I remember that. I think.`,
    (past) => `you said "${past}" once. it didn't go away.`,
];

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
        const template = memoryTemplates[Math.floor(Math.random() * memoryTemplates.length)];
        return template(past);
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
   TYPING GLITCH
   The displayed text corrupts slightly while
   typing, before Enter/Send. The real
   input.value stays 100% correct underneath,
   so what actually gets sent is never affected.
========================= */
function scrambleText(text, rate) {
    let out = "";
    for (let i = 0; i < text.length; i++) {
        out += (text[i] !== " " && Math.random() < rate)
            ? sym[Math.floor(Math.random() * sym.length)]
            : text[i];
    }
    return out;
}

function updateTypingGhosts() {
    const v = input.value;
    ghostMain.textContent = scrambleText(v, 0.07);
    ghost1.textContent = scrambleText(v, 0.18);
    ghost2.textContent = scrambleText(v, 0.18);
}

input.addEventListener("input", updateTypingGhosts);

setInterval(() => {
    if (document.activeElement === input && input.value.length > 0) {
        updateTypingGhosts();
    }
}, 130);

function clearGhosts() {
    ghost1.textContent = "";
    ghost2.textContent = "";
    ghostMain.textContent = "";
}

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
    clearGhosts();

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
   GLITCH ON fracture.png
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
