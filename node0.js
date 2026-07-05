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
// TIMER DISPLAY (SAFE MODE)
////////////////////////////////////////////////////
function renderTimer(){

    const el = document.getElementById("timer");
    if(!el) return;

    const left = window.getTimeLeft?.();

    if(left === null){
        el.innerText = "SYNCING NODE_0...";
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
// NODE IS ALIVE CHECK
////////////////////////////////////////////////////
function bootCheck(){

    if(!window.state){
        if(log) add("NODE_0: waiting for system...");
        return;
    }

    if(log.children.length === 0){
        add("NODE_0: online.");
    }
}

setInterval(bootCheck, 2000);

////////////////////////////////////////////////////
// INPUT SAFE
////////////////////////////////////////////////////
document.getElementById("send")?.addEventListener("click", () => {

    const v = input?.value?.trim();
    if(!v) return;

    add("YOU: " + v);

    input.value = "";
});
