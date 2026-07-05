////////////////////////////////////////////////////
// NODE_0 ENGINE CORE (ARG SYSTEM)
////////////////////////////////////////////////////

const firebaseConfig = {
    databaseURL: "https://node-0-26139-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

////////////////////////////////////////////////////
// GLOBAL STATE
////////////////////////////////////////////////////
window.state = {};

db.ref("/").on("value", (snap) => {
    state = snap.val() || {};
});

////////////////////////////////////////////////////
// EVENTS SYSTEM
////////////////////////////////////////////////////
function pushEvent(type, data = ""){

    db.ref("world/events").push({
        type,
        data,
        time: Date.now()
    });
}

////////////////////////////////////////////////////
// CHAPTER SYSTEM
////////////////////////////////////////////////////
function setChapter(newChapter){

    db.ref("chapter").set(newChapter);

    pushEvent("chapter_shift", newChapter);
}

////////////////////////////////////////////////////
// PUZZLE SYSTEM
////////////////////////////////////////////////////
function checkPuzzle(input){

    if(!state.puzzle?.active) return false;

    const answer = input.trim().toLowerCase();
    const solution = (state.puzzle.solution || "").toLowerCase();

    if(answer === solution){

        const next = (state.chapter || 1) + 1;

        setChapter(next);

        db.ref("puzzle/active").set(false);
        db.ref("puzzle/solvedBy").set("player");

        pushEvent("puzzle_solved", answer);

        return true;
    }

    return false;
}

////////////////////////////////////////////////////
// WORLD INSTABILITY (LIVING WORLD)
////////////////////////////////////////////////////
setInterval(() => {

    let current = state.world?.instability || 0;

    db.ref("world/instability").set(current + Math.random() * 0.5);

    if(current > 10){
        pushEvent("instability_spike", current);
    }

}, 5000);
