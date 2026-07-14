document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const mapWrapEl = document.getElementById("mapWrap");
const sky = document.getElementById("sky");
const canvas = document.getElementById("linesCanvas");
const hiddenStar = document.getElementById("hiddenStar");
const revealPanel = document.getElementById("revealPanel");

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

/* =========================
   MILESTONES -- each tied to a real, existing Firebase flag.
   These stay GLOBAL on purpose: this map shows the whole
   world's shared progress, not just your own.
   Positions are percentages within #sky.
========================= */
const milestones = [
    { key: "SIGNAL", x: 15, y: 70, check: w => w?.node0Discovered === true },
    { key: "NODE_0", x: 28, y: 50, check: w => !!w?.solvedBy },
    { key: "NODE_1", x: 42, y: 65, check: w => !!w?.solvedBy2 },
    { key: "NODE_2", x: 56, y: 40, check: w => !!w?.node2CodeSolvedBy },
    { key: "PORTAL", x: 70, y: 55, check: w => !!w?.solvedBy4 },
    { key: "ARCHIVE", x: 85, y: 35, check: w => (w?.chapter || 1) >= 5 },
];

function updateVisibility() {
    if (!window.ready) return;
    playerRef.child("personalChapter").once("value", snap => {
        const myChapter = snap.val() || 1;
        if (myChapter >= 5) {
            lockedEl.style.display = "none";
            mapWrapEl.style.display = "block";
            render();
        } else {
            lockedEl.style.display = "block";
            mapWrapEl.style.display = "none";
        }
    });
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

let built = false;

function buildBackgroundStars() {
    for (let i = 0; i < 160; i++) {
        const star = document.createElement("div");
        star.className = "star bgstar";
        star.style.top = (Math.random() * 100) + "%";
        star.style.left = (Math.random() * 100) + "%";
        star.style.animationDelay = (Math.random() * 3) + "s";
        sky.appendChild(star);
    }
}

function buildMilestoneStars() {
    milestones.forEach(m => {
        const star = document.createElement("div");
        star.className = "star milestone";
        star.dataset.key = m.key;
        star.style.top = m.y + "%";
        star.style.left = m.x + "%";
        sky.appendChild(star);

        const label = document.createElement("div");
        label.className = "milestone-label";
        label.dataset.key = m.key + "-label";
        label.style.top = m.y + "%";
        label.style.left = m.x + "%";
        sky.appendChild(label);
    });
}

function render() {
    if (!built) {
        buildBackgroundStars();
        buildMilestoneStars();
        built = true;
    }

    const w = window.state && window.state.world;
    const litStates = milestones.map(m => m.check(w));

    milestones.forEach((m, i) => {
        const star = sky.querySelector(`.milestone[data-key="${m.key}"]`);
        const label = sky.querySelector(`[data-key="${m.key}-label"]`);
        const lit = litStates[i];
        star.className = "star milestone " + (lit ? "lit" : "unlit");
        label.textContent = lit ? m.key : "??????";
    });

    drawConnections(litStates);
}

function drawConnections(litStates) {
    const rect = sky.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(127,231,196,0.35)";
    ctx.lineWidth = 1;

    for (let i = 0; i < milestones.length - 1; i++) {
        if (litStates[i] && litStates[i + 1]) {
            const a = milestones[i];
            const b = milestones[i + 1];
            ctx.beginPath();
            ctx.moveTo((a.x / 100) * canvas.width, (a.y / 100) * canvas.height);
            ctx.lineTo((b.x / 100) * canvas.width, (b.y / 100) * canvas.height);
            ctx.stroke();
        }
    }
}

window.addEventListener("resize", () => {
    const w = window.state && window.state.world;
    if (w) drawConnections(milestones.map(m => m.check(w)));
});

/* =========================
   THE HIDDEN STAR
========================= */
hiddenStar.addEventListener("click", () => {
    if (revealPanel.dataset.expanded === "true") return;
    revealPanel.dataset.expanded = "true";
    revealPanel.style.display = "block";
    revealPanel.innerHTML = `
        <p style="margin-bottom:10px;">something is still forming here.</p>
        <input id="phraseInput" placeholder="..." autocomplete="off"
            style="background:#0a0a0a; border:1px solid #444; color:#cfe8ff; padding:8px; font-family:'Courier New', monospace; font-size:13px; width:260px;">
        <button id="phraseSubmit"
            style="background:#1a1a1a; border:1px solid #7fe7c4; color:#7fe7c4; padding:8px 14px; font-family:'Courier New', monospace; font-size:12px; cursor:pointer; margin-left:6px;">ENTER</button>
        <p id="phraseMsg" style="margin-top:10px; font-size:12px;"></p>
    `;

    document.getElementById("phraseSubmit").addEventListener("click", () => {
        const attempt = document.getElementById("phraseInput").value
            .trim().toLowerCase().replace(/\s+/g, "");
        const expected = "theywereneverjusttools";
        const msg = document.getElementById("phraseMsg");

        if (attempt === expected) {
            db.ref("world/combinedPhraseSolvedBy").set(playerId);
            localStorage.setItem("recognition_unlocked", "true");
            msg.style.color = "#7fe7c4";
            msg.textContent = "...redirecting.";
            setTimeout(() => { window.location.href = "recognition.html"; }, 900);
        } else {
            msg.style.color = "#ff6a6a";
            msg.textContent = "not yet.";
        }
    });
});

});
