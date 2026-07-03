<script>
document.addEventListener("DOMContentLoaded", () => {

/* =========================
   ELEMENTS
========================= */

const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const img = document.getElementById("fracture");
const status = document.getElementById("status");
const timer = document.getElementById("timer");

/* =========================
   MEMORY
========================= */

let memory = JSON.parse(localStorage.getItem("node0_memory") || "[]");

function save(){
    localStorage.setItem("node0_memory", JSON.stringify(memory.slice(-50)));
}

/* =========================
   ADD LOG
========================= */

function addLog(msg){
    const p = document.createElement("p");
    p.innerText = msg;
    log.appendChild(p);

    if(log.children.length > 50){
        log.removeChild(log.firstChild);
    }
}

/* =========================
   TIMER (SAFE)
========================= */

const END = new Date("2026-08-08T00:00:00Z").getTime();

function updateTimer(){
    const diff = END - Date.now();
    const s = Math.floor(diff/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const ss = s%60;

    timer.innerText =
    `${d}d ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

setInterval(updateTimer,1000);
updateTimer();

/* =========================
   GLITCH (SAFE SIMPLE)
========================= */

const sym = ["█","#","%","&","@","Ξ","Δ","?"];

function glitch(el){
    if(!el) return;

    const base = el.innerText;
    let out = "";

    for(let i=0;i<base.length;i++){
        out += Math.random()<0.2 ? sym[Math.floor(Math.random()*sym.length)] : base[i];
    }

    el.innerText = out;
    setTimeout(()=>el.innerText = base,150);
}

/* =========================
   SEND (STABLE)
========================= */

function send(){
    if(!input.value.trim()) return;

    const v = input.value.trim();

    memory.push(v);
    save();

    addLog("YOU: " + v);

    setTimeout(() => {
        const r = "NODE_0: " + (Math.random()<0.5 ? v : "I hear you.");
        const p = document.createElement("p");
        p.innerText = r;
        log.appendChild(p);

        if(Math.random()<0.4) glitch(p);

    }, 500);

    input.value = "";
}

btn.addEventListener("click", send);
input.addEventListener("keydown",(e)=>{
    if(e.key==="Enter") send();
});

/* =========================
   LOOP ARG
========================= */

setInterval(() => {

    if(memory.length>0 && Math.random()<0.12){
        addLog("NODE_0 echo -> " + memory[Math.floor(Math.random()*memory.length)]);
    }

    document.querySelectorAll("#log p").forEach(p=>{
        if(Math.random()<0.05) glitch(p);
    });

    if(img){
        img.style.opacity = 0.9 + Math.random()*0.1;
    }

    if(status && memory.length>5){
        status.innerText = "SYSTEM UNSTABLE";
    }

},1200);

});
</script>
