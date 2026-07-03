<script>

// =========================
// PERSISTENCE TIMER (FIX)
// =========================

// date de fin fixe (30 jours depuis 1er lancement)
let start = localStorage.getItem("node0_start");

if(!start){
    start = Date.now();
    localStorage.setItem("node0_start", start);
}

const duration = 30 * 24 * 60 * 60 * 1000; // 30 jours
const endTime = parseInt(start) + duration;

// =========================
// GLITCH ENGINE
// =========================

const symbols = ["█","#","%","&","@","Ø","Ξ","Δ"];

function r(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// glitch GLOBAL (texte entier + logs)
function glitch(el, intensity = 0.25){
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
    }, 120 + Math.random()*200);
}

// =========================
// TIMER UPDATE (PERSISTANT)
// =========================

function updateTimer(){

    let now = Date.now();
    let remaining = endTime - now;

    if(remaining < 0) remaining = 0;

    let totalSeconds = Math.floor(remaining / 1000);

    let d = Math.floor(totalSeconds / (24*3600));
    let h = Math.floor((totalSeconds % (24*3600)) / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    document.getElementById("timer").innerText =
        d + "d " +
        String(h).padStart(2,"0") + ":" +
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");
}

setInterval(updateTimer, 1000);
updateTimer();

// =========================
// LOG SYSTEM + GLITCH AUTOMATIQUE
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

let helpStage = parseInt(localStorage.getItem("help_stage") || "0");

function add(msg){
    const p = document.createElement("p");
    p.innerText = msg;
    log.appendChild(p);

    if(log.children.length > 15){
        log.removeChild(log.children[0]);
    }

    // 👁 glitch garanti après apparition
    setTimeout(()=>{
        glitch(p, 0.35);
    }, 250);
}

// HELP progression persistante
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

    if(Math.random() < 0.7){
        add(stable[Math.floor(Math.random()*stable.length)]);
    }

    if(Math.random() < 0.12){
        add(intrusion[Math.floor(Math.random()*intrusion.length)]);
    }

    if(Math.random() < 0.08){
        helpSequence();
    }

    // GLITCH GLOBAL (TOUT)
    if(Math.random() < 0.6){
        glitch(document.getElementById("title"), 0.2);
        glitch(document.getElementById("status"), 0.25);
        glitch(document.getElementById("timer"), 0.15);

        document.querySelectorAll("#log p").forEach(p=>{
            if(Math.random() < 0.25){
                glitch(p, 0.25);
            }
        });
    }

}, 3500);

</script>
