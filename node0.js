const log = document.getElementById("log");
const input = document.getElementById("input");
const btn = document.getElementById("send");

function add(t){
    const p = document.createElement("p");
    p.innerText = t;

    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

/* =========================
   TIMER DISPLAY
========================= */
function renderTimer(){

    const el = document.getElementById("timer");
    if(!el) return;

    if(!window.ready){
        el.innerText = "CONNECTING NODE_0...";
        return;
    }

    const left = window.getTimeLeft?.();

    if(left === null){
        el.innerText = "TIME SIGNAL LOST";
        return;
    }

    if(left <= 0){
        el.innerText = "█ TIME COLLAPSED █";
        return;
    }

    const d = Math.floor(left / 86400);
    const h = Math.floor((left % 86400)/3600);
    const m = Math.floor((left % 3600)/60);
    const s = left % 60;

    el.innerText =
        `${d}d ${String(h).padStart(2,"0")}:`+
        `${String(m).padStart(2,"0")}:`+
        `${String(s).padStart(2,"0")}`;
}

setInterval(renderTimer, 1000);

/* =========================
   GLITCH SYSTEM
========================= */
const sym = ["█","#","%","&","@","?","Δ","Ξ"];

function glitch(el){
    const base = el.innerText;
    let out = "";

    for(let i=0;i<base.length;i++){
        out += Math.random()<0.2 ? sym[Math.floor(Math.random()*sym.length)] : base[i];
    }

    el.innerText = out;
    setTimeout(()=>el.innerText = base, 120);
}

/* =========================
   SEND SYSTEM (NODE_0 TALKS)
========================= */
function send(){

    const v = input.value.trim();
    if(!v) return;

    add("YOU: " + v);

    setTimeout(() => {

        let reply;

        if(Math.random() < 0.5){
            reply = "NODE_0: I hear you.";
        } else {
            reply = "NODE_0: " + v.split("").reverse().join("");
        }

        const p = document.createElement("p");
        p.innerText = reply;

        log.appendChild(p);
        log.scrollTop = log.scrollHeight;

        if(Math.random() < 0.4){
            glitch(p);
        }

    }, 400);

    input.value = "";
}

btn.onclick = send;
input.addEventListener("keydown", e=>{
    if(e.key === "Enter") send();
});

/* =========================
   LOOP ARG
========================= */
setInterval(() => {

    if(Math.random() < 0.1){
        add("NODE_0: echo...");
    }

    document.querySelectorAll("#log p").forEach(p=>{
        if(Math.random() < 0.03) glitch(p);
    });

}, 1500);
