document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const dossierEl = document.getElementById("dossier");
const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");

const PROFILE_THRESHOLD = 10;

function updateVisibility() {
    if (window.getChapter() >= 3) {
        lockedEl.style.display = "none";
        dossierEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        dossierEl.style.display = "none";
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

function addLine(text, cls = "sys") {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = text;
    log.appendChild(p);
}

function addRedacted(prefix, hiddenValue) {
    const p = document.createElement("p");
    p.className = "sys";
    const span = document.createElement("span");
    span.className = "redacted";
    span.textContent = hiddenValue;
    span.title = "click to reveal";
    span.addEventListener("click", () => {
        span.classList.remove("redacted");
    });
    p.textContent = prefix + " ";
    p.appendChild(span);
    log.appendChild(p);
}

let alreadyAnswered = localStorage.getItem("node2_answered") === "true";

playerRef.once("value", snap => {
    const data = snap.val() || {};
    const researcherNumber = data.researcherNumber || "????";
    const messageCount = data.messageCount || 0;
    const vote = data.chapter2Vote || "none recorded";
    const firstSeen = data.firstSeen ? new Date(data.firstSeen).toISOString().slice(0, 10) : "unknown";

    setTimeout(() => addLine(`> retrieving file for SUBJECT #${researcherNumber}...`), 500);
    setTimeout(() => addLine(`first observed: ${firstSeen}`), 1400);
    setTimeout(() => addLine(`messages exchanged with fragment NODE_0: ${messageCount}`), 2200);
    setTimeout(() => addLine(`stance recorded at NODE_1: ${vote.toUpperCase()}`), 3000);
    setTimeout(() => addRedacted("internal assessment:", "the subject believes they are in control."), 3900);
    setTimeout(() => addRedacted("recommendation:", "continue observation. do not intervene."), 4900);

    setTimeout(() => {
        if (alreadyAnswered) {
            addLine(`> you already answered. the file remains open regardless.`);
        } else {
            addLine(`SUBJECT #${researcherNumber}: do you still believe you're the one asking the questions?`);
        }
    }, 6200);
});

function send() {
    const v = input.value.trim();
    if (!v) return;

    addLine("YOU: " + v, "you");
    input.value = "";

    if (!alreadyAnswered) {
        alreadyAnswered = true;
        localStorage.setItem("node2_answered", "true");
        playerRef.child("node2Answer").set(v);
        db.ref("world/profiledCount").transaction(current => (current || 0) + 1);

        setTimeout(() => {
            addLine("> response logged. file updated.");
            const total = (window.state?.world?.profiledCount || 0);
            if (total + 1 >= PROFILE_THRESHOLD && window.getChapter() === 3) {
                setTimeout(() => {
                    addLine("> observation threshold reached across all subjects.");
                    window.unlockNextChapter();
                }, 1000);
            }
        }, 700);
        return;
    }

    setTimeout(() => {
        addLine("> no further input required at this time.");
    }, 600);
}

btn.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});

});
