<script>

// =========================
// NODE_0 PERSISTENCE CORE
// =========================

const KEY = "node0_start_fixed";

// startTime stable (NE CHANGE JAMAIS après création)
let startTime = localStorage.getItem(KEY);

if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(KEY, startTime);
} else {
    startTime = parseInt(startTime);
}

// HELP progression persistante
let helpStage = parseInt(localStorage.getItem("node0_help") || "0");

// =========================
// TIMER FIXE 30 JOURS
// =========================

const END_TIME = Date.now() + (30 * 24 * 60 * 60 * 1000);

setInterval(() => {

    let now = Date.now();
    let remaining = END_TIME - now;

    if (remaining < 0) remaining = 0;

    let totalSeconds = Math.floor(remaining / 1000);

    let d = Math.floor(totalSeconds / 86400);
    let h = Math.floor((totalSeconds % 86400) / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    document.getElementById("timer").innerText =
        d + "d " +
        String(h).padStart(2,"0") + ":" +
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");

}, 1000);
// =========================
// GLITCH ENGINE (VIVANT)
// =========================

const symbols = ["█", "#", "%", "&", "@", "Ø", "Ξ", "Δ"];

function r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// glitch mot-par-mot (ARG style)
function glitch(el, intensity = 0.3) {

    if (!el) return;

    const original = el.dataset.original || el.innerText;
    el.dataset.original = original;

    const words = original.split(" ");

    let out = words.map(word => {

        if (Math.random() < intensity) {

            let corrupted = "";
            let len = Math.max(2, word.length);

            for (let i = 0; i < len; i++) {
                corrupted += r(symbols);
            }

            return corrupted;
        }

        return word;
    });

    el.innerText = out.join(" ");

    setTimeout(() => {
        el.innerText = original;
    }, 120 + Math.random() * 250);
}

// =========================
// LOG SYSTEM
// =========================

const log = document.getElementById("log");

const stable = [
    "NODE_0 // sleep state active",
    "memory fragmented... stable",
    "fracture integrity nominal",
    "system breathing slowly",
    "no external anomaly detected"
];

const intrusion = [
    "DON'T TRUST NODE_1",
    "I AM STILL HERE",
    "fracture.signal.low",
    "I REMEMBER YOU",
    "YOU ARE BEING WATCHED"
];

function add(msg) {

    const p = document.createElement("p");
    p.innerText = msg;

    log.appendChild(p);

    if (log.children.length > 18) {
        log.removeChild(log.children[0]);
    }

    // glitch automatique sur chaque nouveau message
    setTimeout(() => {
        glitch(p, 0.45);
    }, 200);
}

// =========================
// HELP SEQUENCE (persistante)
// =========================

function helpSequence() {

    const steps = ["H", "HE", "HEL", "HELP", "HELP M", "HELP ME"];

    if (helpStage < steps.length) {
        add(steps[helpStage]);
        helpStage++;

        localStorage.setItem("node0_help", helpStage);
    }
}

// =========================
// LOOP ARG VIVANT
// =========================

setInterval(() => {

    // messages normaux
    if (Math.random() < 0.7) {
        add(stable[Math.floor(Math.random() * stable.length)]);
    }

    // intrusions
    if (Math.random() < 0.18) {
        add(intrusion[Math.floor(Math.random() * intrusion.length)]);
    }

    // HELP lent
    if (Math.random() < 0.07) {
        helpSequence();
    }

    // GLITCH GLOBAL (TOUT PEUT VIVRE)
    if (Math.random() < 0.75) {

        glitch(document.getElementById("title"), 0.25);
        glitch(document.getElementById("status"), 0.25);
        glitch(document.getElementById("timer"), 0.15);

        document.querySelectorAll("#log p").forEach(p => {
            if (Math.random() < 0.35) {
                glitch(p, 0.4);
            }
        });
    }

}, 2500);

</script>
