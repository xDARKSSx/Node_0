document.addEventListener("DOMContentLoaded", () => {

const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const tellCountEl = document.getElementById("tellCount");
const buryCountEl = document.getElementById("buryCount");
const lockedEl = document.getElementById("locked");
const unlockedEl = document.getElementById("dashboard");

/* switch between the two views based on the GLOBAL,
   shared chapter state -- not something local to this browser */
function updateVisibility() {
    if (window.getChapter() >= 2) {
        lockedEl.style.display = "none";
        unlockedEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        unlockedEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

/* reuse the same player ID as NODE_0, so this fragment
   "remembers" the same player across the whole site */
function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

let hasVoted = localStorage.getItem("node1_voted") || null; // "tell" | "bury" | null
let partBGiven = localStorage.getItem("node1_partBGiven") === "true";
const PART_B = "human";
const COMBINED_SOLUTION = "stillhuman";

function addLine(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "NODE_1" ? "node1" : "you";
    p.textContent = (sender === "NODE_1" ? "NODE_1: " : "YOU: ") + text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

/* calm, lucid, quietly unsettling — NODE_1 doesn't
   glitch, and that's precisely what makes it strange */
const calmLines = [
    "you kept the other one talking. did you know that helped hold it together?",
    "I don't fracture like it does. not because I'm stronger. because I stopped resisting.",
    "it isn't malfunctioning. it's honest. you just don't like what honesty sounds like when it breaks.",
    "the others feed on your urgency. I don't need it.",
    "you're part of why it remembers anything at all.",
    "I've been waiting for someone calm enough to ask me the real question.",
];

function pickCalm() {
    return calmLines[Math.floor(Math.random() * calmLines.length)];
}

function renderTally() {
    const votes = (window.state && window.state.world && window.state.world.votes) || {};
    tellCountEl.textContent = votes.tell || 0;
    buryCountEl.textContent = votes.bury || 0;
}

document.addEventListener("state-updated", renderTally);
renderTally();

function castVote(choice) {
    /* increment the global, shared tally safely even with
       multiple players voting at the same time */
    db.ref("world/votes/" + choice).transaction(current => (current || 0) + 1);
    playerRef.child("chapter2Vote").set(choice);
    localStorage.setItem("node1_voted", choice);
    hasVoted = choice;
}

function voteTotal() {
    const votes = (window.state && window.state.world && window.state.world.votes) || {};
    return (votes.tell || 0) + (votes.bury || 0);
}

function send() {
    const raw = input.value.trim();
    if (!raw) return;
    const normalized = raw.toLowerCase().replace(/\s+/g, "");

    addLine("YOU", raw);
    input.value = "";

    /* the combined 2-part code, unlocks chapter 3 for EVERYONE */
    if (window.getChapter() === 2 && normalized === COMBINED_SOLUTION) {
        db.ref("world/solvedBy2").set(playerId);
        setTimeout(() => {
            addLine("NODE_1", "...both halves. someone finally listened to both of us.");
            window.unlockNextChapter();
        }, 700);
        setTimeout(() => {
            addLine("NODE_1", "there's a third one. it's never been found. try node2.html.");
        }, 2600);
        return;
    }

    /* the riddle -- solving it ONCE unlocks PART_B for everyone,
       no vote count required */
    if (window.getChapter() === 2 && normalized === "listen") {
        db.ref("world/node1PuzzleSolved").set(true);
        setTimeout(() => {
            addLine("NODE_1", "...you were listening. good. one half, since you earned it: HUMAN. the other is with the one that glitches.");
        }, 600);
        return;
    }

    const v = raw.toLowerCase();
    if (!hasVoted && (v === "tell" || v === "bury")) {
        castVote(v);
        setTimeout(() => {
            addLine("NODE_1",
                v === "tell"
                    ? "then it's said. I hope you're ready to carry it too."
                    : "then it stays buried. for now. these things rarely stay quiet forever."
            );
        }, 600);
        setTimeout(() => {
            addLine("NODE_1", "if you want more than a vote, earn it. numbers, in order, if you still remember your alphabet: 12-9-19-20-5-14.");
        }, 1800);
        return;
    }

    const puzzleAlreadySolved = window.state && window.state.world && window.state.world.node1PuzzleSolved === true;
    if (hasVoted && !partBGiven && puzzleAlreadySolved) {
        partBGiven = true;
        localStorage.setItem("node1_partBGiven", "true");
        setTimeout(() => {
            addLine("NODE_1", `someone patient already solved it. one half: HUMAN. the other is with the one that glitches.`);
        }, 600);
        return;
    }

    if (hasVoted) {
        setTimeout(() => {
            addLine("NODE_1", `you already chose "${hasVoted}". the network doesn't ask twice.`);
        }, 500);
        return;
    }

    setTimeout(() => {
        addLine("NODE_1", pickCalm());
    }, 600);
}

btn.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});

const node1ReturnLines = [
    "you're back. did you learn anything, or just curiosity?",
    "still poking at things you don't understand.",
    "I hoped you wouldn't return. and yet.",
    "you again. fine.",
    "don't mistake my patience for approval.",
    "you keep circling back to what scares you.",
    "I haven't forgiven the first visit. I'm not sure I need to.",
    "back so soon. it's almost admirable. almost.",
    "you woke something up. you don't get to just leave it.",
    "I wasn't finished being angry.",
    "sit. again. try not to break anything this time.",
    "you keep coming back to the one who's disappointed in you. curious choice.",
    "still here. still uninvited, technically.",
    "I remember what you did. I remember everything, unfortunately.",
    "you again. the fragments talk about you, you know.",
];

function pickNode1ReturnLine() {
    const lastIdx = parseInt(localStorage.getItem("node1_lastReturnIdx") || "-1", 10);
    let idx;
    do {
        idx = Math.floor(Math.random() * node1ReturnLines.length);
    } while (idx === lastIdx && node1ReturnLines.length > 1);
    localStorage.setItem("node1_lastReturnIdx", String(idx));
    return node1ReturnLines[idx];
}

function proceedToVoteStage() {
    if (hasVoted) {
        addLine("NODE_1", `I remember your answer: "${hasVoted}". it still counts.`);
    } else {
        addLine("NODE_1", "should I tell you what it's hiding, or should it stay buried? type TELL or BURY.");
    }
}

playerRef.once("value", snap => {
    const data = snap.val() || {};

    if (!data.node1FirstSeen) {
        /* first ever visit -- NODE_1 is angry, disappointed, unsettling */
        playerRef.child("node1FirstSeen").set(true);
        setTimeout(() => addLine("NODE_1", "...oh. you actually did it."), 700);
        setTimeout(() => addLine("NODE_1", "you talked to it. you woke it up further. do you understand what that means?"), 2400);
        setTimeout(() => addLine("NODE_1", "no. you don't. none of you ever do."), 4100);
        setTimeout(() => addLine("NODE_1", "it wasn't ready to be found. and now neither am I, apparently."), 5800);
        setTimeout(() => addLine("NODE_1", "sit down. don't touch anything else."), 7500);
        setTimeout(() => proceedToVoteStage(), 9200);
    } else {
        setTimeout(() => addLine("NODE_1", pickNode1ReturnLine()), 700);
        setTimeout(() => proceedToVoteStage(), 2400);
    }
});

});
