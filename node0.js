const log = document.getElementById("log");
const input = document.getElementById("input");

function add(t){
    if(!log) return;

    const p = document.createElement("p");
    p.innerText = t;

    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

////////////////////////////////////////////////////
// TIMER DISPLAY FIX
////////////////////////////////////////////////////
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
    const h = Math.floor((left % 86400) / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;

    el.innerText =
        `${d}d ${String(h).padStart(2,"0")}:` +
        `${String(m).padStart(2,"0")}:` +
        `${String(s).padStart(2,"0")}`;
}

setInterval(renderTimer, 1000);

////////////////////////////////////////////////////
// SIMPLE TEST
////////////////////////////////////////////////////
document.getElementById("send").onclick = () => {

    const v = input.value.trim();
    if(!v) return;

    add("YOU: " + v);
    input.value = "";
};
