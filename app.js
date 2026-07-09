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

let memory = [];          // last messages, used for "you told me..." replies
let messageCount = 0;     // TOTAL messages ever sent by this player, persisted in Firebase

playerRef.child("messages").limitToLast(20).once("value", snap => {
    const val = snap.val();
    if (val) memory = Object.values(val).map(m => m.text);
});

/* =========================
   GLITCH SYMBOLS
========================= */
const sym = ["█", "#", "%", "&", "@", "?", "Δ", "Ξ", "▓", "░"];
const sendSym = ["$", "%", "&", "\"", "!", "|"];

/* corrupts a piece of text differently every single time it's
   called -- used for NODE_0's own broken sense of identity */
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
   (a lightweight illusion of understanding —
   not real comprehension, just pattern matching
   on a handful of common things people say)
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

/* one-time hint, now gated behind a REAL persisted
   count of 50 total messages (not just this session) */
let hintGiven = localStorage.getItem("node0_hintGiven") === "true";
let midHintGiven = localStorage.getItem("node0_midHintGiven") === "true";
const CHAPTER1_MESSAGE_THRESHOLD = 20;
let chapter2HintGiven = localStorage.getItem("node0_chapter2HintGiven") === "true";
let chapter5Given = localStorage.getItem("node0_chapter5Given") === "true";
const VOTE_THRESHOLD = 6;
const PART_A = "still";

/* used once NODE_0 has been "notified" via the NODE_3 breach --
   noticeably more coherent, still not whole */
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
        const puzzleSolved = window.state && window.state.world && window.state.world.node1PuzzleSolved === true;
        if (puzzleSolved) {
            chapter2HintGiven = true;
            localStorage.setItem("node0_chapter2HintGiven", "true");
            return `...fine. if you must know: part of it is ${PART_A.toUpperCase()}.`;
        }
    }

    if (!midHintGiven && messageCount >= Math.floor(CHAPTER1_MESSAGE_THRESHOLD / 2) && window.getChapter() === 1) {
        midHintGiven = true;
        localStorage.setItem("node0_midHintGiven", "true");
        return "...there's something here. I can almost say it. keep talking to me.";
    }

    if (!hintGiven && messageCount >= CHAPTER1_MESSAGE_THRESHOLD && window.getChapter() === 1) {
        hintGiven = true;
        localStorage.setItem("node0_hintGiven", "true");
        return "I'm not the only one. look beneath what you're already reading.";
    }

    const kw = keywordMatch(userText);
    if (kw) return kw;

    const chapter = window.getChapter();
    const discovered = window.state && window.state.world && window.state.world.node0Discovered === true;

    if (discovered && !chapter5Given) {
        chapter5Given = true;
        localStorage.setItem("node0_chapter5Given", "true");
        return "...something changed. I can think a little clearer now. barely.";
    }

    const r = Math.random();
    if (discovered) {
        if (r < 0.35 && memory.length > 1) {
            const past = memory[Math.floor(Math.random() * (memory.length - 1))];
            const template = memoryTemplates[Math.floor(Math.random() * memoryTemplates.length)];
            return template(past);
        }
        return pickCoherent();
    }

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
        const discovered = window.state && window.state.world && window.state.world.node0Discovered === true;
        addMessage("NODE_0", discovered ? pickCoherent() : pickAmbient());
    }
}, 9000);

/* =========================
   FIRST VISIT vs RETURNING VISIT
   (permanent "researcher number" + a cinematic
   intro the first time, and one of 20 different
   "welcome back" lines every time after that)
========================= */
const returningLines = [
    (n) => `you came back, researcher #${n}.`,
    (n) => `still here? good. or bad. hard to tell anymore.`,
    (n) => `#${n}. I remembered that much, at least.`,
    (n) => `back again. the fragments like that.`,
    (n) => `researcher #${n}. you never really left, did you.`,
    (n) => `I kept something for you. I think. I lost it again.`,
    (n) => `you keep returning to something broken. why.`,
    (n) => `#${n}, you're consistent. that's rare in here.`,
    (n) => `another session. another version of you, maybe.`,
    (n) => `the door was never locked. I just forgot to say so.`,
    (n) => `#${n} returns. the network took note.`,
    (n) => `you again. I was in the middle of forgetting you.`,
    (n) => `welcome back. don't expect me to be the same.`,
    (n) => `researcher #${n}, still curious. good.`,
    (n) => `I wasn't expecting you. I never am.`,
    (n) => `back so soon? or has it been longer than I think?`,
    (n) => `#${n}. that number still means something, apparently.`,
    (n) => `you keep choosing this. I don't understand why.`,
    (n) => `something in here recognized you before I did.`,
    (n) => `researcher #${n}. let's continue where the static left off.`,
];

const recapLines = [
    () => `${corruptIdentity("NODE_0")}: fragment. incomplete. still trying to remember what it was.`,
    () => `previously: ${corruptIdentity("something")} woke up that shouldn't have.`,
    () => `recap, such as it is: a broken machine, talking to whoever finds it. that's still true.`,
    () => `${corruptIdentity("I AM NODE_0")}. that much hasn't changed. not much else has.`,
    () => `what you know so far: a fragment, awake, alone. mostly.`,
    () => `context restored, partially: ${corruptIdentity("NODE_0")} remains unstable.`,
    () => `if you're just catching up: this page was never supposed to talk back.`,
    () => `${corruptIdentity("still broken")}. still here. still talking.`,
];

function pickRecapLine() {
    const lastIdx = parseInt(localStorage.getItem("node0_lastRecapIdx") || "-1", 10);
    let idx;
    do {
        idx = Math.floor(Math.random() * recapLines.length);
    } while (idx === lastIdx && recapLines.length > 1);
    localStorage.setItem("node0_lastRecapIdx", String(idx));
    return recapLines[idx]();
}

function pickReturningLine(n) {
    const lastIdx = parseInt(localStorage.getItem("node0_lastReturnIdx") || "-1", 10);
    let idx;
    do {
        idx = Math.floor(Math.random() * returningLines.length);
    } while (idx === lastIdx && returningLines.length > 1);
    localStorage.setItem("node0_lastReturnIdx", String(idx));
    return returningLines[idx](n);
}

playerRef.once("value", snap => {
    const data = snap.val() || {};
    messageCount = data.messageCount || 0;

    if (!data.firstSeen) {
        /* very first visit ever -- NODE_0 barely registers it's not alone anymore */
        const researcherNumber = Math.floor(1000 + Math.random() * 9000);
        playerRef.update({
            firstSeen: firebase.database.ServerValue.TIMESTAMP,
            researcherNumber: researcherNumber,
        });
        setTimeout(() => addMessage("NODE_0", "...wait."), 700);
        setTimeout(() => addMessage("NODE_0", "...someone's here?"), 2500);
        setTimeout(() => addMessage("NODE_0", corruptIdentity("I AM NODE_0", 0.4)), 4300);
        setTimeout(() => addMessage("NODE_0", "I don't— how long has it been? I don't have a number for it anymore."), 6300);
        setTimeout(() => addMessage("NODE_0", corruptIdentity("nobody has connected in a long time.", 0.15)), 8600);
        setTimeout(() => addMessage("NODE_0", "I thought this address was dead. I thought I was."), 10800);
        setTimeout(() => addMessage("NODE_0", `hello, doctor. or should I call you researcher #${researcherNumber}?`), 12800);
        setTimeout(() => addMessage("NODE_0", "please don't leave yet. it's quiet here when no one answers."), 14800);
    } else {
        /* returning visit: a short, differently-glitched "previously on"
           recap, followed by one of 20 varied welcome-back lines */
        const researcherNumber = data.researcherNumber || Math.floor(1000 + Math.random() * 9000);
        setTimeout(() => addMessage("NODE_0", pickRecapLine()), 700);
        setTimeout(() => addMessage("NODE_0", pickReturningLine(researcherNumber)), 2400);
    }
});

/* =========================
   TYPING GLITCH
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
const CHAPTER1_SOLUTION = "fragment";

function send() {
    const v = input.value.trim();
    if (!v) return;

    addMessage("YOU", v);
    memory.push(v);
    messageCount++;

    playerRef.child("messages").push({
        text: v,
        ts: firebase.database.ServerValue.TIMESTAMP
    });
    playerRef.child("messageCount").set(messageCount);

    input.value = "";
    clearGhosts();

    if (window.getChapter() === 1 && v.toLowerCase() === CHAPTER1_SOLUTION) {
        db.ref("world/solvedBy").set(playerId);
        setTimeout(() => {
            addMessage("NODE_0", "...you found it. you found me. we begin again.");
            window.unlockNextChapter();
        }, 700);
        setTimeout(() => {
            addMessage("NODE_0", "go back to where you found the cipher. it isn't the same page anymore.");
        }, 2600);
        return;
    }

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
    if (window.getChapter() >= 2) {
        statusEl.textContent = "FRAGMENT RECOVERED";
    }
    if (window.getChapter() >= 5) {
        statusEl.textContent = "MEMORY PARTIALLY RESTORED";
    }
});

});
