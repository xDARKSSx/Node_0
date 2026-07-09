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

/* =========================
   MILESTONES -- each tied to a real, existing Firebase flag.
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
    lockedEl.style.display = "none";
    mapWrapEl.style.display = "block";
    render();
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
    db.ref("world/hiddenStarFoundBy").set(playerId);
    revealPanel.style.display = "block";
    revealPanel.textContent = "??? — something is still forming here. this connection isn't ready yet.";
});

});
