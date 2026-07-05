const log = document.getElementById("log");
const input = document.getElementById("input");

const symbols = ["█","#","%","&","@","?","$"];

function add(msg){

    const p = document.createElement("p");
    p.innerText = msg;

    log.appendChild(p);

    if(log.children.length > 60){
        log.removeChild(log.firstChild);
    }

    log.scrollTop = log.scrollHeight;
}

////////////////////////////////////////////////////
// TIMER DISPLAY (FIX FINAL)
////////////////////////////////////////////////////
function updateTimer(){

    const el = document.getElementById("timer");
    if(!el) return;

    const left = window.getTimeLeft ? window.getTimeLeft() : null;

    if(left === null){
        el.innerText = "SYSTEM TIME NOT INITIALIZED";
        return;
    }

    if(left <= 0){
        el.innerText = "█ TIME COLLAPSED █";
        return;
    }

    const d = Math.floor(left / 86400);
    const h = Math.floor((left % 86400) / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;

    el.innerText =
        `${d}d ${String(h).padStart(2,"0")}:` +
        `${String(m).padStart(2,"0")}:` +
        `${String(s).padStart(2,"0")}`;
}

setInterval(updateTimer, 1000);

////////////////////////////////////////////////////
// SEND SIMPLE (SAFE)
////////////////////////////////////////////////////
document.getElementById("send").onclick = () => {

    const v = input.value.trim();
    if(!v) return;

    add("YOU: " + v);

    input.value = "";
};
