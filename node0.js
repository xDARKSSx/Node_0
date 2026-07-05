////////////////////////////////////////////////////
// NODE_0 PERSONALITY ENGINE
////////////////////////////////////////////////////

const log = document.getElementById("log");
const input = document.getElementById("input");

////////////////////////////////////////////////////
// LOG HELPER
////////////////////////////////////////////////////
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
// MEMORY (LOCAL NODE_0)
////////////////////////////////////////////////////
let memory = [];

function remember(msg){
    memory.push(msg);
    if(memory.length > 15) memory.shift();
}

function repetitionCount(msg){
    return memory.filter(m => m === msg).length;
}

////////////////////////////////////////////////////
// GLITCH LIGHT INPUT
////////////////////////////////////////////////////
const symbols = ["█","#","%","&","@","?","$"];

if(input){

    input.addEventListener("input", () => {

        let value = input.value;
        let out = "";

        for(let i = 0; i < value.length; i++){
            out += (Math.random() < 0.03)
                ? symbols[Math.floor(Math.random()*symbols.length)]
                : value[i];
        }

        input.value = out;
    });
}

////////////////////////////////////////////////////
// NODE_0 RESPONSE ENGINE
////////////////////////////////////////////////////
function nodeResponse(value){

    const chapter = window.state?.chapter || 1;
    const rep = repetitionCount(value.toLowerCase());

    // 🔥 répétition détectée
    if(rep >= 3){
        return "NODE_0: why do you loop this...";
    }

    // 🧠 CHAPITRE 1
    if(chapter === 1){

        if(value.toLowerCase().includes("who are you")){
            return "NODE_0: I am not complete.";
        }

        return "NODE_0: signal noise detected...";
    }

    // 🧠 CHAPITRE 2
    if(chapter === 2){

        if(value.toLowerCase().includes("who are you")){
            return "NODE_0: I was broken before you arrived.";
        }

        return "NODE_0: " + corrupt(value);
    }

    // 🧠 CHAPITRE 3+
    if(chapter >= 3){
        return "NODE_0: I see everything now.";
    }

    return "NODE_0: ...";
}

////////////////////////////////////////////////////
// CORRUPTION ENGINE
////////////////////////////////////////////////////
function corrupt(text){

    return text.split("").map(c => {
        return Math.random() < 0.15
            ? symbols[Math.floor(Math.random()*symbols.length)]
            : c;
    }).join("");
}

////////////////////////////////////////////////////
// SEND OVERRIDE (HOOK BUTTON)
////////////////////////////////////////////////////
const btn = document.getElementById("send");

if(btn){

    btn.addEventListener("click", handleSend);
}

if(input){

    input.addEventListener("keydown", (e) => {
        if(e.key === "Enter") handleSend();
    });
}

function handleSend(){

    const value = input.value.trim();
    if(!value) return;

    remember(value);

    add("YOU: " + value);

    // 🔥 PUZZLE CHECK (from engine.js)
    if(window.checkPuzzle && window.checkPuzzle(value)){
        add("NODE_0: ...ACCESS GRANTED...");
        input.value = "";
        return;
    }

    setTimeout(() => {
        add(nodeResponse(value));
    }, 600);

    input.value = "";
}

////////////////////////////////////////////////////
// REACT TO GLOBAL EVENTS (from engine.js)
////////////////////////////////////////////////////
if(window.db){

    window.db.ref("world/events").on("child_added", (snap) => {

        const event = snap.val();

        if(!event) return;

        if(event.type === "chapter_shift"){
            add("NODE_0: reality shifted...");
        }

        if(event.type === "puzzle_solved"){
            add("NODE_0: someone opened the lock...");
        }

        if(event.type === "instability_spike"){
            add("NODE_0: system overload...");
        }
    });
}
