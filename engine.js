////////////////////////////////////////////////////
// FIREBASE INIT
////////////////////////////////////////////////////
const firebaseConfig = {
    databaseURL: "https://node-0-26139-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.state = {};
window.firebaseReady = false;

db.ref("/").on("value", (snap) => {

    window.state = snap.val() || {};
    window.firebaseReady = true;
});

////////////////////////////////////////////////////
// GLOBAL TIMER (FIXED SAFE ACCESS)
////////////////////////////////////////////////////
window.getTimeLeft = function(){

    if(!window.firebaseReady) return null;

    const world = window.state.world;

    if(!world) return null;

    const start = world.timerStart;
    const duration = world.timerDuration;

    if(!start || !duration) return null;

    const now = Math.floor(Date.now() / 1000);

    return (start + duration) - now;
};

////////////////////////////////////////////////////
// EVENTS
////////////////////////////////////////////////////
function pushEvent(type, data = ""){

    db.ref("world/events").push({
        type,
        data,
        time: Date.now()
    });
}

////////////////////////////////////////////////////
// CHAPTER
////////////////////////////////////////////////////
function setChapter(next){

    db.ref("chapter").set(next);
    pushEvent("chapter_shift", next);
}

////////////////////////////////////////////////////
// TIMER TRIGGERS
////////////////////////////////////////////////////
setInterval(() => {

    const left = window.getTimeLeft();
    if(left === null) return;

    const day = 86400;

    // 15 days trigger
    if(left < 15 * day && !window.state?.world?.layer2Triggered){

        db.ref("world/layer2Triggered").set(true);
        pushEvent("timer_layer_2", left);
    }

    // END
    if(left <= 0 && !window.state?.world?.layer3Triggered){

        db.ref("world/layer3Triggered").set(true);
        pushEvent("timer_end", 0);

        setChapter((window.state.chapter || 1) + 1);
    }

}, 3000);
