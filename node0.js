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

let memory = [];

function remember(m){
    memory.push(m);
    if(memory.length > 15) memory.shift();
}

function repeat(m){
    return memory.filter(x => x === m).length;
}

////////////////////////////////////////////////////
// GLITCH INPUT
////////////////////////////////////////////////////
if(input){

    input.addEventListener("input", () => {

        let v = input.value;
        let o = "";

        for(let i = 0; i < v.length; i++){
            o += Math.random() < 0.03
                ? symbols[Math.floor(Math.random()*symbols.length)]
                : v[i];
        }

        input.value = o;
    });
}

////////////////////////////////////////////////////
// LIE SYSTEM
////////////////////////////////////////////////////
function maybeLie(t){

    const c = window.state?.chapter || 1;
    const chance = c === 1 ? 0.1 : c === 2 ? 0.35 : 0.6;

    if(Math.random() < chance){
        return corrupt(t);
    }

    return t;
}

function hiddenHint(){

    const f = ["w","a","k","e"];

    if(Math.random() < 0.08){
        return f[Math.floor(Math.random()*f.length)];
    }

    return "";
}

function corrupt(t){

    return t.split("").map(c => {
        return Math.random() < 0.15
            ? symbols[Math.floor(Math.random()*symbols.length)]
            : c;
    }).join("");
}

////////////////////////////////////////////////////
// RESPONSE ENGINE
////////////////////////////////////////////////////
function nodeResponse(v){

    const c = window.state?.chapter || 1;

    let r = "";

    if(c === 1){

        if(v.includes("who are you")){
            r = "NODE_0: incomplete.";
        } else {
            r = "NODE_0: signal unstable...";
        }
    }

    if(c === 2){

        if(v.includes("who are you")){
            r = "NODE_0: I was broken.";
        } else {
            r = "NODE_0: " + corrupt(v);
        }
    }

    if(c >= 3){
        r = "NODE_0: I see everything.";
    }

    const h = hiddenHint();
    if(h) r += " " + h;

    return maybeLie(r);
}

////////////////////////////////////////////////////
// SEND
////////////////////////////////////////////////////
function send(){

    const v = input.value.trim();
    if(!v) return;

    remember(v);

    add("YOU: " + v);

    if(window.checkPuzzle && window.checkPuzzle(v)){
        add("NODE_0: ACCESS GRANTED");
        input.value = "";
        return;
    }

    setTimeout(() => {
        add(nodeResponse(v));
    }, 600);

    input.value = "";
}

document.getElementById("send").onclick = send;

input.addEventListener("keydown", (e) => {
    if(e.key === "Enter") send();
});

////////////////////////////////////////////////////
// EVENTS
////////////////////////////////////////////////////
if(window.db){

    window.db.ref("world/events").on("child_added", (s) => {

        const e = s.val();
        if(!e) return;

        if(e.type === "chapter_shift"){
            add("NODE_0: reality shift...");
        }

        if(e.type === "fragment_found"){
            add("NODE_0: fragment detected...");
        }

        if(e.type === "timer_end"){
            add("NODE_0: TIME COLLAPSE...");
        }
    });
}
