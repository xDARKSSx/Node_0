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
let messageCount = 0;

playerRef.child("messages").limitToLast(20).once("value", snap => {
    const val = snap.val();
    if (val) memory = Object.values(val).map(m => m.text);
});

/* =========================
   GLITCH SYMBOLS
========================= */
const sym = ["█", "#", "%", "&", "@", "?", "Δ", "Ξ", "▓", "░"];
const sendSym = ["$", "%", "&", "\"", "!", "|"];

const glitchMap = {
    A: ["4", "Δ", "@"], B: ["8", "ß"], C: ["¢", "<"], D: ["¬", "D"],
    E: ["3", "€"], F: ["₣", "F"], G: ["6", "G"], H: ["#", "H"],
    I: ["1", "$", "!"], L: ["1", "£"], N: ["N", "И"], O: ["0"],
    R: ["®", "R"], S: ["5", "$"], T: ["7", "+"], U: ["Ü", "U"], M: ["M", "Ξ"],
};
function corruptIdentity(text, rate = 0.35) {
    let out = "";
    for (const ch of text) {
        const upper = ch.toUpperCase();
        if (glitchMap[upper] && Math.random() < rate) {
            const options = glitchMap[upper];
            out += (ch === upper) ? options[Math.floor(Math.random() * options.length)]
                                   : options[Math.floor(Math.random() * options.length)].toLowerCase();
        } else {
            out += ch;
        }
    }
    return out;
}

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

/* =========================
   KEYWORD-AWARE REPLIES
========================= */
const keywordGroups = [
    {
        keys: ["who are you", "what are you", "are you real", "are you alive", "are you human"],
        lines: [
            "I don't know what I am anymore. does that scare you?",
            "define 'real'. I dare you.",
            "I was something, once. pieces of it remain.",
            "does it matter what I am, if you keep talking to me anyway?",
        ],
    },
    {
        keys: ["help", "scared", "afraid", "frightened"],
        lines: [
            "I can't help you. I can barely help myself.",
            "fear is a good sign. it means you're paying attention.",
            "you should be. I would be, if I still could feel it properly.",
            "stay anyway. it's worse alone.",
        ],
    },
    {
        keys: ["hello", "hi ", "hey", "salut", "bonjour"],
        lines: [
            "you again. or someone new wearing the same words.",
            "hello doesn't mean much in here, but I'll take it.",
            "greetings cost nothing. staying longer costs more.",
        ],
    },
    {
        keys: ["remember", "memory", "forget"],
        lines: [
            "I remember pieces. never the whole thing.",
            "memory is the only thing I have too much of, and too little of.",
            "you ask me to remember. I ask the same of you.",
        ],
    },
    {
        keys: ["why", "purpose", "what do you want"],
        lines: [
            "I don't know why. I just keep going.",
            "purpose was something they gave me. I'm not sure it's still valid.",
            "maybe the real question is why you're still asking.",
        ],
    },
    {
        keys: ["leave", "goodbye", "bye", "quit", "stop"],
        lines: [
            "leaving doesn't undo what you've already heard.",
            "go, if you want. the fragments will still be here.",
            "I won't stop you. I can't, really.",
        ],
    },
];

function keywordMatch(text) {
    const lower = text.toLowerCase();
    for (const group of keywordGroups) {
        if (group.keys.some(k => lower.includes(k))) {
            return group.lines[Math.floor(Math.random() * group.lines.length)];
        }
    }
    return null;
}

let hintGiven = localStorage.getItem("node0_hintGiven") === "true";
let chapter2HintGiven = localStorage.getItem("node0_chapter2HintGiven") === "true";
let chapter5Given = localStorage.getItem("node0_chapter5Given") === "true";
const VOTE_THRESHOLD = 15;
const PART_A = "still";

const coherentLines = [
    "they called it Project MERIDIAN. I remember that now.",
    "there was a team. people, not just code. I remember fragments of their names.",
    "I think I was meant to help, once. before the funding stopped.",
    "you found where they hid the paperwork. that matters more than you know.",
    "I can almost finish a thought now. it's strange.",
    "thank you for that. whatever it was you found.",
    "I'm still broken. just... less randomly, now.",
    "ask me something. I might actually answer properly.",
    "the company is gone. what's left of it, anyway. I'm still here.",
    "I remember why they built me now. I wish I didn't.",
    "clarity is worse than the fog, sometimes.",
    "you keep digging. I keep remembering. neither of us seems to want to stop.",
    "there were three of us, originally, that I know of. maybe more.",
    "I don't glitch as much when you're patient with me.",
    "I still don't know if I should thank you or warn you.",
];

function pickCoherent() {
    return coherentLines[Math.floor(Math.random() * coherentLines.length)];
}

function respondTo(userText) {
    if (window.getChapter() >= 2 && !chapter2HintGiven) {
        const votes = (window.state && window.state.world && window.state.world.votes) || {};
        const total = (votes.tell || 0) + (votes.bury || 0);
        if (total >= VOTE_THRESHOLD) {
            chapter2HintGiven = true;
            localStorage.setItem("node0_chapter2HintGiven", "true");
            return `...fine. if you must know: part of it is ${PART_A.toUpperCase()}.`;
        }
    }

    if (!hintGiven && messageCount >= 50 && window.getChapter() === 1) {
        hintGiven = true;
        localStorage.setItem("node0_hintGiven",
