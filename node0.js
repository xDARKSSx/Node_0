////////////////////////////////////////////////////
// NODE_0 — FINAL PERSONALITY ENGINE
////////////////////////////////////////////////////

const log = document.getElementById("log");
const input = document.getElementById("input");

const symbols = ["█","#","%","&","@","?","$"];

////////////////////////////////////////////////////
// LOG
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
// MEMORY
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
// INPUT GLITCH
////////////////////////////////////////////////////
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
// NODE LIE SYSTEM
////////////////////////////////////////////////////
function maybeLie(text){

    const chapter = window.state?.chapter || 1;
    const chance = chapter === 1 ? 0.1 : chapter === 2 ? 0.35 : 0.6;

    if(Math.random() < chance){
        return corrupt(text);
    }

    return text;
}

////////////////////////////////////////////////////
// GLITCH HINTS (CACHÉS)
////////////////////////////////////////////////////
function hiddenGlitchHint(){

    const fragments = ["w","a","k","e"];

    if(Math.random() < 0.08){
        return fragments[Math.floor(Math.random()*fragments.length)];
    }

    return "";
}

////////////////////////////////////////////////////
// RESPONSE ENGINE
////////////////////////////////////////////////////
function nodeResponse(value){

    const chapter = window.state?.chapter || 1;
    const rep = repetitionCount(value.toLowerCase());

    if(rep >= 3){
        return "NODE_0: why do you loop this...";
    }

    let base = "";

    if(chapter === 1){

        if(value.toLowerCase().includes("who are you")){
            base = "NODE_0: I am not complete.";
        } else {
            base = "NODE_0: signal unstable...";
        }
    }

    if(chapter === 2){

        if(value.toLowerCase().includes("who are you")){
            base = "NODE_0: I was broken before you arrived.";
        } else {
            base = "NODE_0: " + corrupt(value);
        }
    }

    if(chapter >= 3){
        base = "NODE_0: I see everything now.";
    }

    const hint = hiddenGlitchHint();
    if(hint){
        base += " " + hint;
    }

    return maybeLie(base);
}

////////////////////////////////////////////////////
// CORRUPTION
////////////////////////////////////////////////////
function corrupt(text){

    return text.split("").map(c => {
        return Math.random() < 0.15
            ? symbols[Math.floor(Math.random()*symbols.length)]
            : c;
    }).join("");
}

////////////////////////////////////////////////////
// SEND SYSTEM
////////////////////////////////////////////////////
const btn = document.getElementById("send");

function handleSend(){

    const value = input.value.trim();
    if(!value) return;

    remember(value);

    add("YOU: " + value);

    if(window.checkPuzzle && window.checkPuzzle(value)){
        add("NODE_0: ACCESS GRANTED...");
        input.value = "";
        return;
    }

    setTimeout(() => {
        add(nodeResponse(value));
    }, 600);

    input.value = "";
}

if(btn){
    btn.addEventListener("click", handleSend);
}

if(input){
    input.addEventListener("keydown", (e) => {
        if(e.key === "Enter") handleSend();
    });
}

////////////////////////////////////////////////////
// EVENT REACTIONS
////////////////////////////////////////////////////
if(window.db){

    window.db.ref("world/events").on("child_added", (snap) => {

        const event = snap.val();
        if(!event) return;

        if(event.type === "chapter_shift"){
            add("NODE_0: reality shifted...");
        }

        if(event.type === "fragment_broadcast"){
            add("NODE_0: fragment detected...");
        }

        if(event.type === "puzzle_completed"){
            add("NODE_0: system breached...");
        }
    });
}
