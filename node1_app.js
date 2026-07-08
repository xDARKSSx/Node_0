document.addEventListener("DOMContentLoaded", () => {

const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const tellCountEl = document.getElementById("tellCount");
const buryCountEl = document.getElementById("buryCount");
const lockedEl = document.getElementById("locked");
const unlockedEl = document.getElementById("unlocked");

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

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

let hasVoted = localStorage.getItem("node1_voted") || null;
let partBGiven = localStorage.getItem("node1_partBGiven") === "true";
const VOTE_THRESHOLD = 15;
const PART_B = "human";
const COMBINED_SOLUTION = "stillhuman";

function addLine(sender, text) {
    const p = document.createElement("p");
    p.className = sender === "NODE_1" ? "node1" : "you";
    p.textContent = (sender === "NODE_1" ? "NODE_1: " : "YOU: ") + text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

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

    if (window.getChapter() === 2 && normalized === COMBINED_SOLUTION) {
        db.ref("world/solvedBy2").set(playerId);
        setTimeout(() => {
            addLine("NODE_1", "...both halves. someone finally listened to both of us.");
            window.unlockNextChapter();
        }, 700);
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
        return;
    }

    if (hasVoted && !partBGiven && voteTotal() >= VOTE_THRESHOLD) {
        partBGiven = true;
        localStorage.setItem("node1_partBGiven", "true");
        setTimeout(() => {
            addLine("NODE_1", `enough voices now. one half, since you asked: ${PART_B.toUpperCase()}. the other is with the one that glitches.`);
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

setTimeout(() => {
    addLine("NODE_1", "...you found this part of me. good. sit for a moment.");
}, 700);

setTimeout(() => {
    if (hasVoted) {
        addLine("NODE_1", `I remember your answer: "${hasVoted}". it still counts.`);
    } else {
        addLine("NODE_1", "should I tell you what it's hiding, or should it stay buried? type TELL or BURY.");
    }
}, 2200);

});
