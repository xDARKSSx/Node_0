////////////////////////////////////////////////////
// NODE_0 ENGINE — FINAL STABLE VERSION
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
// EVENT SYSTEM
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
function setChapter(next){

    db.ref("chapter").set(next);
    pushEvent("chapter_shift", next);
}

////////////////////////////////////////////////////
// DISTRIBUTED FRAGMENT SYSTEM
////////////////////////////////////////////////////
function broadcastFragment(fragment){
    pushEvent("fragment_broadcast", fragment);
}

////////////////////////////////////////////////////
// PUZZLE SYSTEM (FINAL MULTI-LAYER)
////////////////////////////////////////////////////
function checkPuzzle(input){

    if(!state.puzzle?.active) return false;

    const answer = input.trim().toLowerCase();
    const solution = (state.puzzle.solution || "").toLowerCase();
    const layer = state.puzzle.layer || 1;

    // 🔹 LAYER 1
    if(layer === 1){

        if(answer === solution){

            db.ref("puzzle/layer").set(2);
            db.ref("puzzle/progress").set(0);

            pushEvent("puzzle_layer_1_complete", answer);

            return true;
        }

        return false;
    }

    // 🔹 LAYER 2 (fragments)
    if(layer === 2){

        const fragments = ["w","a","k","e"];

        if(fragments.includes(answer)){

            let current = state.puzzle.fragmentsFound || 0;
            current++;

            db.ref("puzzle/fragmentsFound").set(current);

            pushEvent("fragment_found", answer);
            broadcastFragment(answer);

            if(current >= fragments.length){
                db.ref("puzzle/layer").set(3);
            }

            return true;
        }

        return false;
    }

    // 🔹 LAYER 3 (final)
    if(layer === 3){

        if(answer === solution){

            const next = (state.chapter || 1) + 1;

            setChapter(next);

            db.ref("puzzle/active").set(false);
            db.ref("puzzle/solvedBy").set("player");

            pushEvent("puzzle_completed", answer);

            return true;
        }

        return false;
    }

    return false;
}

////////////////////////////////////////////////////
// WORLD INSTABILITY
////////////////////////////////////////////////////
setInterval(() => {

    let current = state.world?.instability || 0;

    db.ref("world/instability").set(current + Math.random() * 0.4);

    if(current > 10){
        pushEvent("instability_spike", current);
    }

}, 6000);
