<script>

// =========================
// NODE_0 TIMER STABLE (FIXE ABSOLU)
// =========================

// IMPORTANT : date fixe (NE PEUT PAS RESET)
const END = new Date("2026-08-08T00:00:00Z").getTime();

function updateTimer() {

  const timer = document.getElementById("timer");
  if (!timer) return;

  const now = Date.now();
  const diff = END - now;

  if (diff <= 0) {
    timer.innerText = "NODE_0 ACTIVE";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timer.innerText =
    `${days}d ${String(hours).padStart(2,"0")}:` +
    `${String(minutes).padStart(2,"0")}:` +
    `${String(seconds).padStart(2,"0")}`;
}

setInterval(updateTimer, 1000);
updateTimer();


// =========================
// GLITCH ENGINE GLOBAL
// =========================

const symbols = ["█","#","%","&","@","Ø","Ξ","Δ","?","$"];

function r(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function glitch(el, intensity = 0.3){

  if(!el) return;

  const original = el.dataset.original || el.innerText;
  el.dataset.original = original;

  const words = original.split(" ");

  const out = words.map(word => {

    if(Math.random() < intensity){

      let corrupted = "";
      const len = Math.max(2, word.length);

      for(let i = 0; i < len; i++){
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
// LOG SYSTEM (ARG VIVANT)
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

function addLog(msg){

  if(!log) return;

  const p = document.createElement("p");
  p.innerText = msg;

  log.appendChild(p);

  if(log.children.length > 20){
    log.removeChild(log.children[0]);
  }

  // glitch après apparition
  setTimeout(() => {
    glitch(p, 0.45);
  }, 200);
}


// =========================
// HELP SEQUENCE (persistant simple safe)
// =========================

let helpStage = 0;

function helpSequence(){

  const steps = ["H","HE","HEL","HELP","HELP M","HELP ME"];

  if(helpStage < steps.length){
    addLog(steps[helpStage]);
    helpStage++;
  }
}


// =========================
// MAIN LOOP ARG VIVANT
// =========================

setInterval(() => {

  // logs normaux
  if(Math.random() < 0.7){
    addLog(stable[Math.floor(Math.random() * stable.length)]);
  }

  // intrusions
  if(Math.random() < 0.2){
    addLog(intrusion[Math.floor(Math.random() * intrusion.length)]);
  }

  // HELP progression lente
  if(Math.random() < 0.06){
    helpSequence();
  }

  // GLITCH GLOBAL (TOUT VIVANT)
  if(Math.random() < 0.75){

    glitch(document.getElementById("title"), 0.25);
    glitch(document.getElementById("status"), 0.25);
    glitch(document.getElementById("timer"), 0.15);

    document.querySelectorAll("#log p").forEach(p => {
      if(Math.random() < 0.35){
        glitch(p, 0.4);
      }
    });
  }

}, 2500);

</script>
