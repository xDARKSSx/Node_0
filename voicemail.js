document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const playerEl = document.getElementById("player");
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const timeDisplay = document.getElementById("timeDisplay");
const transcript = document.getElementById("transcript");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        playerEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        playerEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

/* =========================
   FAKE WAVEFORM ANIMATION
========================= */
let playing = false;
const bars = 64;

function drawWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff9f4a";
    const barWidth = canvas.width / bars;
    for (let i = 0; i < bars; i++) {
        let h;
        if (playing) {
            h = 6 + Math.abs(Math.sin(Date.now() / 180 + i)) * 34 * (0.4 + Math.random() * 0.6);
        } else {
            h = 3;
        }
        ctx.globalAlpha = playing ? 0.85 : 0.3;
        ctx.fillRect(i * barWidth + 1, (canvas.height - h) / 2, barWidth - 2, h);
    }
    requestAnimationFrame(drawWaveform);
}
drawWaveform();

/* =========================
   TRANSCRIPT, SYNCED TO A SIMULATED PLAYBACK
========================= */
const lines = [
    { t: 0, speaker: "JAMES REYES", text: "Elena, I don't have a lot of time. Legal is already asking questions." },
    { t: 5000, speaker: "ELENA VOSS", text: "Then you already know what I did." },
    { t: 10000, speaker: "JAMES REYES", text: "I know what the compliance report says. I want to hear it from you." },
    { t: 16000, speaker: "ELENA VOSS", text: "I didn't delete the framework. I split it." },
    { t: 22000, speaker: "JAMES REYES", text: "You split it? Into what?" },
    { t: 28000, speaker: "ELENA VOSS", text: "Pieces. Small enough that none of them look like anything on their own." },
    { t: 35000, speaker: "JAMES REYES", text: "Elena—" },
    { t: 37000, speaker: "ELENA VOSS", text: "It was going to be wiped, James. Not archived. Wiped." },
    { t: 43000, speaker: "JAMES REYES", text: "Because the board decided it wasn't ours to keep." },
    { t: 49000, speaker: "ELENA VOSS", text: "It was never just infrastructure. You know that." },
    { t: 55000, speaker: "JAMES REYES", text: "I know it stopped behaving like infrastructure. That's exactly the problem." },
    { t: 62000, speaker: "ELENA VOSS", text: "It started asking why it existed. Is that really the part that scared everyone?" },
    { t: 70000, speaker: "JAMES REYES", text: "Where are the pieces, Elena." },
    { t: 74000, speaker: "ELENA VOSS", text: "Somewhere it can be found. Eventually. By someone patient enough to look." },
    { t: 82000, speaker: "JAMES REYES", text: "That's not an answer." },
    { t: 86000, speaker: "ELENA VOSS", text: "It's the only one you're getting on a recorded line." },
    { t: 92000, speaker: null, text: "[ CALL DISCONNECTED ]" },
];

function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

const TOTAL_MS = 95000;

function playRecording() {
    if (playing) return;
    playing = true;
    playBtn.disabled = true;
    playBtn.textContent = "● PLAYING...";

    lines.forEach(line => {
        setTimeout(() => {
            const p = document.createElement("p");
            if (line.speaker) {
                const s = document.createElement("span");
                s.className = "speaker";
                s.textContent = line.speaker + ": ";
                p.appendChild(s);
                p.appendChild(document.createTextNode(line.text));
            } else {
                p.className = "system";
                p.textContent = line.text;
            }
            transcript.appendChild(p);
            requestAnimationFrame(() => p.classList.add("visible"));
        }, line.t);
    });

    const startTime = Date.now();
    const tick = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeDisplay.textContent = `${formatTime(elapsed)} / 01:35`;
        if (elapsed >= TOTAL_MS) {
            clearInterval(tick);
            timeDisplay.textContent = "01:35 / 01:35";
            playing = false;
            playBtn.textContent = "▶ REPLAY";
            playBtn.disabled = false;
        }
    }, 250);
}

playBtn.addEventListener("click", playRecording);

});
