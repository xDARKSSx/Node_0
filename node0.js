const log = document.getElementById("log");
const input = document.getElementById("input");
const timerEl = document.getElementById("timer");
const img = document.getElementById("fracture");

let memory = [];

/* =========================
   LOG
========================= */
function add(t){
    const p = document.createElement("p");
    p.innerText = t;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

/* =========================
   TIMER 30 JOURS (LOCAL FIXE)
========================= */
const END = Date.now() + 30*24*60*60*1000;

function updateTimer(){
    const diff = END - Date.now();

    const s = Math.floor(diff/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const ss = s%60;

    timerEl.innerText =
    `${d}d ${String(h).padStart(2,"0")}:`+
    `${String(m).padStart(2,"0")}:`+
    `${String(ss).padStart(2,"0")}`;
}

setInterval(updateTimer,1000);
updateTimer();

/* =========================
   GLITCH
========================= */
const sym = ["█","#","%","&","@","?","Δ","Ξ"];

function glitch(el){
    const base = el.innerText;
    let out = "";

    for(let i=0;i<base.length;i++){
        out += Math.random()<0.25 ? sym[Math.floor(Math.random()*sym.length)] : base[i];
    }

    el.innerText = out;
    setTimeout(()=>el.innerText = base,120);
}

/* =========================
   NODE_0 CORE (VIVANT)
========================= */
function reply(user){

    memory.push(user);

    const answers = [
        "I hear you...",
        "something is wrong",
        "█ fracture growing █",
        "do not trust me",
        user.split("").reverse().join(""),
        "echo detected"
    ];

    const msg = "NODE_0: " + answers[Math.floor(Math.random()*answers.length)];

    const p = document.createElement("p");
    p.innerText = msg;

    log.appendChild(p);
    log.scrollTop = log.scrollHeight;

    if(Math.random()<0.6){
        glitch(p);
    }

    /* FRACTURE VISUAL */
    if(img){
        img.style.opacity = 0.5 + Math.random()*0.5;
        img.style.filter = `contrast(${1 + Math.random()})`;
    }
}

/* =========================
   SEND
========================= */
document.getElementById("send").onclick = () => {

    const v = input.value.trim();
    if(!v) return;

    add("YOU: " + v);

    setTimeout(()=>reply(v),500);

    input.value = "";
};

/* =========================
   AMBIANCE LOOP
========================= */
setInterval(()=>{

    if(Math.random()<0.2){
        add("NODE_0: echo...");
    }

    document.querySelectorAll("#log p").forEach(p=>{
        if(Math.random()<0.05) glitch(p);
    });

},1200);
