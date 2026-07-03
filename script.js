<script>

// =========================
// NODE_0 PERSISTENCE CORE
// =========================

// mémorise le début UNE SEULE FOIS
let startTime = localStorage.getItem("node0_start");

if(!startTime){
    startTime = Date.now();
    localStorage.setItem("node0_start", startTime);
}

// progression HELP persistante
let helpStage = parseInt(localStorage.getItem("node0_help") || "0");

// =========================
// TIMER 30 JOURS FIXE
// =========================

const duration = 30 * 24 * 60 * 60 * 1000;
const endTime = parseInt(startTime) + duration;

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
// GLITCH ENGINE GLOBAL
// =========================

const symbols = ["█","#","%","&","@","Ø","Ξ","Δ"];

function r(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// glitch INTELLIGENT (mots complets + chaos)
function glitch(el, intensity = 0.25){

    if(!el) return;

    const original = el.dataset.original || el.innerText;
    el.dataset.original = original;

    const words = original.split(" ");

    let out = words.map(word => {

        if(Math.random() < intensity){

            let corrupted = "";
            let len = Math.max(2, word.length);

            for(let i=0;i<len;i++){
                corrupted += r(symbols);
            }

            return corrupted;
        }

        return word;
    });

    el.innerText = out.join(" ");

    setTimeout(()=>{
        el.innerText = original;
    }, 120 + Math.random()*220);
}

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

function add(msg){

    const p = document.createElement("p");
    p.innerText = msg;

    log.appendChild(p);

    if(log.children.length > 15){
        log.removeChild(log.children[0]);
    }

    // 👁 glitch GARANTI après apparition
    setTimeout(()=>{
        glitch(p, 0.4);
    }, 200);
}

// =========================
// HELP SEQUENCE (persistante)
// =========================

function helpSequence(){

    const steps = ["H","HE","HEL","HELP","HELP M","HELP ME"];

    if(helpStage < steps.length){

        add(steps[helpStage]);

        helpStage++;
        localStorage.setItem("node0_help", helpStage);
    }
}

// =========================
// LOOP PRINCIPAL (VIVANT MAIS STABLE)
// =========================

setInterval(()=>{

    // logs normaux
    if(Math.random() < 0.7){
        add(stable[Math.floor(Math.random()*stable.length)]);
    }

    // intrusion
    if(Math.random() < 0.15){
        add(intrusion[Math.floor(Math.random()*intrusion.length)]);
    }

    // HELP lent
    if(Math.random() < 0.08){
        helpSequence();
    }

    // GLITCH GLOBAL (TOUT)
    if(Math.random() < 0.7){

        glitch(document.getElementById("title"), 0.25);
        glitch(document.getElementById("status"), 0.25);
        glitch(document.getElementById("timer"), 0.15);

        // glitch sur TOUS les logs visibles
        document.querySelectorAll("#log p").forEach(p=>{
            if(Math.random() < 0.35){
                glitch(p, 0.35);
            }
        });
    }

}, 3000);

</script>
