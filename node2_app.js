document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const dossierEl = document.getElementById("dossier");
const textlog = document.getElementById("textlog");
const sigCanvas = document.getElementById("sigCanvas");
const finalQuestion = document.getElementById("finalQuestion");
const questionText = document.getElementById("questionText");
const slider = document.getElementById("stanceSlider");
const confirmBtn = document.getElementById("confirmBtn");
const afterAnswer = document.getElementById("afterAnswer");

const PROFILE_THRESHOLD = 5;

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

function addLine(text) {
    const p = document.createElement("p");
    p.textContent = text;
    textlog.appendChild(p);
}

/* ===== unique visual "signature" per player, deterministic ===== */
function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
}
function drawSignature(canvas, seedStr) {
    const ctx = canvas.getContext("2d");
    let seed = hashStr(seedStr) || 1;
    function rand() {
        seed = (seed * 1103515245 + 12345) >>> 0;
        return (seed % 10000) / 10000;
    }
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#ff6a3d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const points = 60;
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const y = h / 2 + Math.sin(i * 0.6 + rand() * 8) * (h * 0.32) * (0.5 + rand());
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

/* ===== scratch-to-reveal cards ===== */
function initScratch(canvas) {
    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        paint();
    }
    const ctx = canvas.getContext("2d");
    function paint() {
        ctx.fillStyle = "#160b07";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 150; i++) {
            ctx.fillStyle = `rgba(255,106,61,${Math.random() * 0.06})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
    }
    resize();
    window.addEventListener("resize", resize);

    let drawing = false;
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - rect.left, y: cy - rect.top };
    }
    function erase(x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
    }
    canvas.addEventListener("mousedown", e => { drawing = true; const p = getPos(e); erase(p.x, p.y); });
    canvas.addEventListener("mousemove", e => { if (drawing) { const p = getPos(e); erase(p.x, p.y); } });
    window.addEventListener("mouseup", () => drawing = false);
    canvas.addEventListener("touchstart", e => { drawing = true; const p = getPos(e); erase(p.x, p.y); e.preventDefault(); }, { passive: false });
    canvas.addEventListener("touchmove", e => { if (drawing) { const p = getPos(e); erase(p.x, p.y); } e.preventDefault(); }, { passive: false });
    window.addEventListener("touchend", () => drawing = false);
}

let alreadyAnswered = localStorage.getItem("node2_answered") === "true";

playerRef.once("value", snap => {
    const data = snap.val() || {};
    const researcherNumber = data.researcherNumber || "????";
    const messageCount = data.messageCount || 0;
    const vote = data.chapter2Vote || "none recorded";
    const firstSeen = data.firstSeen ? new Date(data.firstSeen).toISOString().slice(0, 10) : "unknown";

    let offset = 0;

    if (!data.node2FirstSeen) {
        /* first visit -- cold, procedural, almost inhuman.
           NODE_2 doesn't introduce itself. it just observes. */
        playerRef.child("node2FirstSeen").set(true);
        setTimeout(() => addLine("> new observation session initiated."), 500);
        setTimeout(() => addLine("> unlike the others, this layer does not introduce itself. it records."), 2000);
        setTimeout(() => addLine("> you were not supposed to find this."), 3500);
        setTimeout(() => addLine("> proceeding anyway."), 5000);
        offset = 6500;
    } else {
        setTimeout(() => addLine("> file reopened. nothing has changed since your last visit. that is either reassuring, or it isn't."), 500);
        offset = 2000;
    }

    setTimeout(() => addLine(`> retrieving file for SUBJECT #${researcherNumber}...`), offset + 400);
    setTimeout(() => addLine(`first observed: ${firstSeen}`), offset + 1100);
    setTimeout(() => addLine(`messages exchanged with fragment NODE_0: ${messageCount}`), offset + 1800);
    setTimeout(() => addLine(`stance recorded at NODE_1: ${vote.toUpperCase()}`), offset + 2500);

    setTimeout(() => {
        drawSignature(sigCanvas, playerId);
        document.getElementById("scratch1Text").textContent = "the subject believes they are in control.";
        document.getElementById("scratch2Text").textContent = "continue observation. do not intervene.";
        initScratch(document.getElementById("scratch1"));
        initScratch(document.getElementById("scratch2"));
    }, offset + 3200);

    setTimeout(() => {
        finalQuestion.style.display = "block";
        if (alreadyAnswered) {
            questionText.textContent = `SUBJECT #${researcherNumber}: your position has already been logged.`;
            slider.disabled = true;
            confirmBtn.disabled = true;
            confirmBtn.textContent = "ALREADY RECORDED";
        } else {
            questionText.textContent = `SUBJECT #${researcherNumber}: do you still believe you're the one asking the questions?`;
        }
    }, offset + 4200);
});

confirmBtn.addEventListener("click", () => {
    if (alreadyAnswered) return;
    alreadyAnswered = true;
    localStorage.setItem("node2_answered", "true");

    const value = parseInt(slider.value, 10);
    playerRef.child("node2Stance").set(value);
    db.ref("world/profiledCount").transaction(current => (current || 0) + 1);

    slider.disabled = true;
    confirmBtn.disabled = true;
    confirmBtn.textContent = "LOGGED";

    afterAnswer.style.display = "block";
    afterAnswer.textContent = "> response logged. file updated.";

    setTimeout(() => {
        const total = (window.state?.world?.profiledCount || 0);
        if (total >= PROFILE_THRESHOLD && window.getChapter() === 3) {
            afterAnswer.textContent += " observation threshold reached across all subjects.";
            window.unlockNextChapter();
            setTimeout(() => {
                afterAnswer.textContent += " new tabs just surfaced on the parent network. check your mail.";
            }, 1200);
        } else if (window.getChapter() >= 4) {
            afterAnswer.textContent = "> the parent network now shows a Mail tab and a Researchers portal. look there.";
        }
    }, 900);
});

});
