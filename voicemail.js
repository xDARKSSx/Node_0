document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const playerEl = document.getElementById("player");
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const timeDisplay = document.getElementById("timeDisplay");
const transcript = document.getElementById("transcript");
const audioEl = document.getElementById("audioEl");

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
   REAL AUDIO ANALYSIS (Web Audio API)
   drives the waveform from the actual file
========================= */
let audioCtx, analyser, dataArray, sourceNode;

function setupAudioGraph() {
    if (audioCtx) return; // only set up once
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaElementSource(audioEl);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
}

function drawWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff9f4a";

    if (analyser && !audioEl.paused) {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = canvas.width / dataArray.length;
        for (let i = 0; i < dataArray.length; i++) {
            const h = (dataArray[i] / 255) * canvas.height * 0.9;
            ctx.globalAlpha = 0.85;
            ctx.fillRect(i * barWidth + 1, (canvas.height - h) / 2, barWidth - 2, Math.max(h, 3));
        }
    } else {
        const bars = 64;
        const barWidth = canvas.width / bars;
        for (let i = 0; i < bars; i++) {
            ctx.globalAlpha = 0.25;
            ctx.fillRect(i * barWidth + 1, canvas.height / 2 - 1, barWidth - 2, 3);
        }
    }
    requestAnimationFrame(drawWaveform);
}
drawWaveform();

/* =========================
   TRANSCRIPT, synced to actual playback time
   (timestamps scaled proportionally to real audio duration)
========================= */
const lines = [
    { t: 0, speaker: "JAMES REYES", text: "Elena, I don't have a lot of time. Legal is already asking questions." },
    { t: 4, speaker: "ELENA VOSS", text: "Then you already know what I did." },
    { t: 7, speaker: "JAMES REYES", text: "I know what the compliance report says. I want to hear it from you." },
    { t: 11, speaker: "ELENA VOSS", text: "I didn't delete the framework. I split it." },
    { t: 15, speaker: "JAMES REYES", text: "You split it? Into what?" },
    { t: 18, speaker: "ELENA VOSS", text: "Pieces. Small enough that none of them look like anything on their own." },
    { t: 23, speaker: "JAMES REYES", text: "Elena—" },
    { t: 24, speaker: "ELENA VOSS", text: "It was going to be wiped, James. Not archived. Wiped." },
    { t: 28, speaker: "JAMES REYES", text: "Because the board decided it wasn't ours to keep." },
    { t: 32, speaker: "ELENA VOSS", text: "It was never just infrastructure. You know that." },
    { t: 36, speaker: "JAMES REYES", text: "I know it stopped behaving like infrastructure. That's exactly the problem." },
    { t: 40, speaker: "ELENA VOSS", text: "It started asking why it existed. Is that really the part that scared everyone?" },
    { t: 45, speaker: "JAMES REYES", text: "Where are the pieces, Elena." },
    { t: 48, speaker: "ELENA VOSS", text: "Somewhere it can be found. Eventually. By someone patient enough to look." },
    { t: 52, speaker: "JAMES REYES", text: "That's not an answer." },
    { t: 54, speaker: "ELENA VOSS", text: "It's the only one you're getting on a recorded line." },
    { t: 56, speaker: null, text: "[ CALL DISCONNECTED ]" },
];
/* NOTE: these are approximate cue times (in seconds) based on the
   actual 57s recording. Adjust the "t" values above if any line
   appears noticeably early or late once you've tested it. */

let revealedCount = 0;

function formatTime(sec) {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function checkTranscriptReveal() {
    const current = audioEl.currentTime;
    while (revealedCount < lines.length && lines[revealedCount].t <= current) {
        const line = lines[revealedCount];
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
        revealedCount++;
    }
}

function updateLoop() {
    if (!audioEl.paused && !audioEl.ended) {
        const dur = isNaN(audioEl.duration) ? 57 : audioEl.duration;
        timeDisplay.textContent = `${formatTime(audioEl.currentTime)} / ${formatTime(dur)}`;
        checkTranscriptReveal();
        requestAnimationFrame(updateLoop);
    }
}

playBtn.addEventListener("click", () => {
    setupAudioGraph();
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (audioEl.ended || audioEl.currentTime > 0) {
        // replay from scratch
        audioEl.currentTime = 0;
        transcript.innerHTML = "";
        revealedCount = 0;
    }

    audioEl.play();
    playBtn.disabled = true;
    playBtn.textContent = "● PLAYING...";
    requestAnimationFrame(updateLoop);
});

audioEl.addEventListener("ended", () => {
    playBtn.disabled = false;
    playBtn.textContent = "▶ REPLAY";
    const dur = isNaN(audioEl.duration) ? 57 : audioEl.duration;
    timeDisplay.textContent = `${formatTime(dur)} / ${formatTime(dur)}`;
    checkTranscriptReveal();
});

});
