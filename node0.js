const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const img = document.getElementById("fracture");
const timerEl = document.getElementById("timer");

/* =========================
   LOG SYSTEM
========================= */
function add(t){
    const p = document.createElement("p");
    p.innerText = t;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

/* =========================
   TIMER (30 DAYS FIXED)
   (NE REBOOT PAS)
========================= */
const END = Date.now() + 30*24*60*60*1000;

function updateTimer(){

    const diff = END - Date.now();

    const s = Math.floor(diff/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const ss = s%60;

    if(diff <= 0){
        timerEl.innerText = "█ TIME COLLAPSED █";
        return;
    }

    timerEl.innerText =
        `${d}d ${String(h).padStart(2,"0")}:`+
        `${String(m).padStart(2,"0")}:`+
        `${String(ss).padStart(2,"0")}`;
}

setInterval(updateTimer,1000);

/* =========================
   GLITCH SYSTEM (FORT + STABLE)
========================= */
const sym = ["█","#","%","&","@","?","Δ","Ξ","▓"];

function glitch(el){

    const base = el.innerText;
    let out = "";

    for(let i=0;i<base.length;i++){
        out += Math.random()<0.3
            ? sym[Math.floor(Math.random()*sym.length)]
            : base[i];
    }

    el.innerText = out;
    setTimeout(()=>el.innerText = base, 120);
}

/* =========================
   NODE_0 AI (PAS “ECHO BOT”)
========================= */
function reply(user){

    const pool = [
        "I hear you... but something is wrong.",
        "Your message is stored in a broken layer.",
        "Do not assume I am stable.",
        "I remember fragments of you.",
        "This system is not complete.",
        "█ interference detected █",
        "Why do you keep writing to me?"
    ];

    let msg = pool[Math.floor(Math.random()*pool.length)];

    const p = document.createElement("p");
    p.innerText = "NODE_0: " + msg;

    log.appendChild(p);
    log.scrollTop = log.scrollHeight;

    if(Math.random()<0.7) glitch(p);

    /* FRACTURE VISUAL */
    if(img){
        img.style.opacity = 0.5 + Math.random()*0.5;
        img.style.filter = `contrast(${1 + Math.random()})`;
    }
}

/* =========================
   SEND + ENTER FIX
========================= */
function send(){

    const v = input.value.trim();
    if(!v) return;

    add("YOU: " + v);

    setTimeout(()=>reply(v), 500);

    input.value = "";
}

/* BUTTON */
btn.onclick = send;

/* ENTER FIX */
input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") send();
});

/* =========================
   AMBIENCE LOOP
========================= */
setInterval(()=>{

    if(Math.random()<0.15){
        const p = document.createElement("p");
        p.innerText = "NODE_0: ...signal drifting...";
        log.appendChild(p);
        glitch(p);
    }

    document.querySelectorAll("#log p").forEach(p=>{
        if(Math.random()<0.05) glitch(p);
    });

},1200);
