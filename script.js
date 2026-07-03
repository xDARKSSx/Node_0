<script>

// =========================
// PERSISTENCE (MEMOIRE)
// =========================

let startTime = localStorage.getItem("node0_start");

if(!startTime){
    startTime = Date.now();
    localStorage.setItem("node0_start", startTime);
}

let helpStage = parseInt(localStorage.getItem("help_stage") || "0");

// =========================
// TIMER 1 MOIS (PERSISTANT VISUEL)
// =========================

let totalSeconds = 30 * 24 * 60 * 60;

// =========================
// GLITCH ENGINE GLOBAL
// =========================

const symbols = ["█","#","%","&","@","Ø","Ξ","Δ"];

function r(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// glitch UNIVERSEL (important)
function glitchText(el, intensity = 0.25){
    if(!el) return;

    const original = el.dataset.original || el.innerText;
    el.dataset.original = original;

    const words = original.split(" ");

    let out = words.map(w => {
        if(Math.random() < intensity){
            let c = "";
            for(let i=0;i<Math.max(2,w.length);i++){
                c += r(symbols);
            }
            return c;
        }
        return w;
    });

    el.innerText = out.join(" ");

    setTimeout(()=>{
        el.innerText = original;
    }, 150 + Math.random()*250);
}

// =========================
// TIMER UPDATE
// =========================

function updateTimer(){
    let d = Math.floor(totalSeconds / (24*3600));
    let h = Math.floor((totalSeconds % (24*3600)) / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    document.getElementById("timer").innerText =
        d + "d " +
        String(h).padStart(2,"0") + ":" +
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");

    if(totalSeconds > 0) totalSeconds--;
}

setInterval(updateTimer, 1000);
updateTimer();

// =========================
// LOG SYSTEM (MAINTENANT GLITCHABLE)
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
    "I REMEMBER YOU"
];

// add log + GLITCH IMMEDIATEMENT APRES
function add(msg){
    const p = document.createElement("p");
    p.innerText = msg;
    log.appendChild(p);

    if(log.children.length > 15){
        log.removeChild(log.children[0]);
    }

    // 👁 glitch immédiat sur nouveaux logs
    setTimeout(()=>{
        glitchText(p, 0.35);
    }, 300);
}

// =========================
// HELP PROGRESSION (PERSISTANTE)
// =========================

function helpSequence(){
    const steps = ["H","HE","HEL","HELP","HELP M","HELP ME"];

    if(helpStage < steps.length){
        add(steps[helpStage]);
        helpStage++;

        localStorage.setItem("help_stage", helpStage);
    }
}

// =========================
// LOOP PRINCIPAL
// =========================

setInterval(()=>{

    // logs normaux
    if(Math.random() < 0.7){
        add(stable[Math.floor(Math.random()*stable.length)]);
    }

    // intrusion
    if(Math.random() < 0.12){
        add(intrusion[Math.floor(Math.random()*intrusion.length)]);
    }

    // HELP lent
    if(Math.random() < 0.08){
        helpSequence();
    }

    // GLITCH GLOBAL (TOUT)
    if(Math.random() < 0.6){
        glitchText(document.getElementById("title"), 0.2);
        glitchText(document.getElementById("status"), 0.25);
        glitchText(document.getElementById("timer"), 0.15);

        // 🔥 IMPORTANT : glitch aussi les logs visibles
        document.querySelectorAll("#log p").forEach(p=>{
            if(Math.random() < 0.3){
                glitchText(p, 0.25);
            }
        });
    }

}, 3500);

// =========================
// ÉVOLUTION TEMPS (MEMOIRE)
// =========================

let elapsed = Date.now() - startTime;

// bonus futur (on utilisera plus tard)
console.log("NODE_0 runtime:", elapsed);

</script>
