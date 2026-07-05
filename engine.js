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
// SAFE TIMER (ULTRA STABLE)
////////////////////////////////////////////////////
window.getTimeLeft = function(){

    if(!window.firebaseReady) return null;

    const world = window.state?.world;

    if(!world) return null;

    if(world.timerStart == null || world.timerDuration == null) return null;

    const now = Math.floor(Date.now() / 1000);

    return (world.timerStart + world.timerDuration) - now;
};

////////////////////////////////////////////////////
// TIMER EVENTS
////////////////////////////////////////////////////
setInterval(() => {

    const left = window.getTimeLeft();
    if(left === null) return;

    const day = 86400;

    if(left < 15 * day && !window.state?.world?.layer2Triggered){

        db.ref("world/layer2Triggered").set(true);
        console.log("Layer 2 triggered");
    }

    if(left <= 0 && !window.state?.world?.layer3Triggered){

        db.ref("world/layer3Triggered").set(true);

        db.ref("chapter").set((window.state.chapter || 1) + 1);
        console.log("Timer ended");
    }

}, 3000);
